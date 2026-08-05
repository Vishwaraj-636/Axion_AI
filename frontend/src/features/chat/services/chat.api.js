import axios from "axios";

const API_URL = "http://localhost:8000/api/chat"; // Or from env vars

const chatApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const sendMessage = async (message, chatId) => {
  const { data } = await chatApi.post("/message", { message, chat: chatId });
  return data;
};

export const getChats = async () => {
  const { data } = await chatApi.get("/chats");
  return data;
};

export const getMessages = async (chatId) => {
  const { data } = await chatApi.get(`/chats/${chatId}/messages`);
  return data;
};
