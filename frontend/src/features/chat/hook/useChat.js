import { initializeSocketConnection } from "../services/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat } from "../services/chat.api";
import { setChats, setCurrentChatId, setError, setIsLoading, createNewChat, addNewMessage } from "../chat.slice";
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

  return {
    initializeSocketConnection,
    handleSendMessage
  }
}