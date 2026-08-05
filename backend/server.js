import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import http from "http";
import { initSocket } from "./src/sockets/server.socket.js";



dotenv.config();

const PORT = process.env.PORT || 8000;

const httpServer = http.createServer(app);
initSocket(httpServer);

const startServer = async () => {
  try {
    await connectDB();
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server due to database connection failure.");
    process.exit(1);
  }
};

startServer();