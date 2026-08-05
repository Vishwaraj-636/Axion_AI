import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.router.js";
import morgan from "morgan";
import chatRouter from "./routes/chat.routes.js";


const app = express();
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

// Allow frontend dev server to make requests with credentials
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.get("/", (req, res) => {
  res.json({ message: "Server is Running" });
})

app.use("/api/auth", authRouter);
app.use("/api/chats", chatRouter);


export default app;