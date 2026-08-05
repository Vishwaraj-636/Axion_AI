import {Router} from 'express';
import { sendMessage } from '../controllers/chat.controller.js';
import { authUser } from '../middleware/auth.middleware.js';


const chatRouter = Router();


chatRouter.post("/message", authUser, sendMessage)
chatRouter.get("/chats", authUser, getChats)



export default chatRouter;