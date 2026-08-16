import {io} from "socket.io-client";

let socket = null;

export const initializeSocketConnection = () => {
  if (socket?.connected) return socket;

  socket = io("http://localhost:3000", {
    withCredentials: true,
  });

  socket.on("connect", () => {
    console.log("Connected to socket server with id: " + socket.id);
  });

  return socket;
}