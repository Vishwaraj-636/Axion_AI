import { initializeSocketConnection } from "../services/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat } from "../services/chat.api";
import { setChats, setCurrentChatId, setError, setIsLoading, setIsChatsLoading, createNewChat, addNewMessage, addMessages, removeChat } from "../chat.slice";
import { useDispatch } from "react-redux";



export const useChat = () => {
  const dispatch = useDispatch();

  async function handleSendMessage(message, chatId) {
    dispatch(setIsLoading(true));

    try {
      const data = await sendMessage({ message, chatId });
      const { chat, aiMessage } = data;
      const resolvedChatId = chat?._id || chatId;

      if (!chatId) {
        dispatch(createNewChat({
          chatId: chat._id,
          title: chat.title,
        }));
      }

      dispatch(addNewMessage({
        chatId: chatId || chat._id,
        content: message,
        role: "user",
      }));

      dispatch(addNewMessage({
        chatId: chatId || chat._id,
        content: aiMessage.content,
        role: aiMessage.role,
      }));

      dispatch(setCurrentChatId(resolvedChatId));
      dispatch(setError(null));
    } catch (error) {
      dispatch(setError(error?.response?.data?.message || "Failed to send message"));
    } finally {
      dispatch(setIsLoading(false));
    }

  }

  async function handleGetChats() {
    dispatch(setIsChatsLoading(true));
    try {
      const data = await getChats();
      const { chats } = data

      const newChatsObj = chats.reduce((acc, chat) => {
        acc[chat._id] = {
          id: chat._id,
          title: chat.title,
          messages: [],
          lastUpdated: new Date().toISOString(),
        }
        return acc;
      }, {});

      dispatch(setChats(newChatsObj));
    } finally {
      dispatch(setIsChatsLoading(false));
    }
  }

  async function handleOpenChat(chatId, chats) {

    if (chats[chatId]?.messages.length === 0) {

      if (!chatId) return;

      dispatch(setIsLoading(true));

      try {
        const data = await getMessages(chatId);
        const { messages } = data;
        const formattedMessages = messages.map(msg => ({
          content: msg.content,
          role: msg.role
        }));

        dispatch(addMessages({
          chatId,
          messages: formattedMessages
        }));
        dispatch(setCurrentChatId(chatId));
        dispatch(setError(null));
      }
      catch (error) {
        dispatch(setError(error?.response?.data?.message || "Failed to open chat"));
      }
      finally {
        dispatch(setIsLoading(false));
      }
    }
    dispatch(setCurrentChatId(chatId));
  }

  async function handleDeleteChat(chatId) {
    try {
      dispatch(setIsLoading(true));
      await deleteChat(chatId);
      dispatch(removeChat(chatId));
    } catch (error) {
      dispatch(setError(error?.response?.data?.message || "Failed to delete chat"));
    } finally {
      dispatch(setIsLoading(false));
    }
  }

  return {
    initializeSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
    handleDeleteChat
  }
}