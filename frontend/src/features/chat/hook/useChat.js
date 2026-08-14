import { initializeSocketConnection } from "../services/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat } from "../services/chat.api";
import { setChats, setCurrentChatId, setError, setIsLoading, createNewChat, addNewMessage, addMessages } from "../chat.slice";
import { useDispatch } from "react-redux";



export const useChat = () => {
  const dispatch = useDispatch();

  async function handleSendMessage(message, chatId) {
    dispatch(setIsLoading(true));

    try {
      const data = await sendMessage({ message, chatId });
      const { chat, aiMessage } = data;
      const resolvedChatId = chat?._id || chatId;

      if (chat) {
        dispatch(createNewChat({
          chatId: chat._id,
          title: chat.title,
        }));
      }

      dispatch(addNewMessage({
        chatId: resolvedChatId,
        content: message,
        role: "user",
      }));

      dispatch(addNewMessage({
        chatId: resolvedChatId,
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
    dispatch(setIsLoading(true));
    const data = await getChats();
    const { chats } = data

    dispatch(setChats(chats.reduce((acc, chat) => {
      acc[chat._id] = {
        id: chat._id,
        title: chat.title,
        messages: [],
        lastUpdated: new Date().toISOString(),
      }
      return acc;
    }, {})));
    dispatch(setIsLoading(false));

  }

  async function handleOpenChat(chatId) {
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
    } catch (error) {
      dispatch(setError(error?.response?.data?.message || "Failed to open chat"));
    } finally {
      dispatch(setIsLoading(false));
    }
  }
  return {
    initializeSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleOpenChat
  }
}