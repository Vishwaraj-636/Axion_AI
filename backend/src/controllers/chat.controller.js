import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import chatModel from "../model/chat.model.js";
import messageModel from "../model/message.model.js";

export async function sendMessage(req, res) {

  const { message, chat: chatId } = req.body;

  let title = null, chat = null
  let activeChatId = chatId;

  if (!chatId) {
    title = await generateChatTitle(message);
    chat = await chatModel.create({
      user: req.user.id,
      title
    })
    activeChatId = chat._id;
  }

  const userMessage = await messageModel.create({
    chat: activeChatId,
    content: message,
    role: "user"
  })


  const messages = await messageModel.find({ chat: activeChatId })

  const result = await generateResponse(messages);

  const aiMessage = await messageModel.create({
    chat: activeChatId,
    content: result,
    role: "ai"
  })


  console.log(messages)

  res.status(201).json({
    title,
    chat,
    aiMessage
  });

}

export async function getChats(req, res) {
  const user = req.user

  const chats = await chatModel.find({user:user.id})
}