import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/config/database.js";
// import { testAI } from "./src/services/ai.service.js";

dotenv.config();
// testAI()

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server due to database connection failure.");
    process.exit(1);
  }
};

startServer();