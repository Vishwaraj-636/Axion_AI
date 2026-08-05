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
