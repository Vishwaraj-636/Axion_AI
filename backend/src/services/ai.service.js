import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";

function getGeminiModel() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  return new ChatGoogleGenerativeAI({
    model: "gemini-3.1-flash-lite",
    apiKey: process.env.GEMINI_API_KEY,
  });
}

function getMistralModel() {
  if (!process.env.MISTRAL_API_KEY) {
    return null;
  }

  return new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY,
  });
}

function createFallbackTitle(message) {
  return message
    .trim()
    .split(/\s+/)
    .slice(0, 5)
    .join(" ")
    .replace(/[.!?]+$/g, "") || "New Chat";
}

export async function generateResponse(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error("At least one message is required to generate a response.");
  }

  const promptMessages = messages
    .map((msg) => {
      if (msg.role === "user") {
        return new HumanMessage(msg.content);
      }

      if (msg.role === "ai") {
        return new AIMessage(msg.content);
      }

      return null;
    })
    .filter(Boolean);

  if (promptMessages.length === 0) {
    throw new Error("No supported messages were provided to generate a response.");
  }

  const geminiModel = getGeminiModel();
  const response = await geminiModel.invoke(promptMessages);

  return response.content;
}

export async function generateChatTitle(message) {
  const prompt = [
    new SystemMessage(`
        You are a helpful assistant that generates concise and relevant titles for chat conversations.

        User will provide a message, and you will generate a title that accurately reflects the content of the message. The title should be brief, clear, and informative. Avoid using generic titles like "Chat" or "Conversation." Instead, focus on capturing the essence of the message in a 2-5 words.
      `),
    new HumanMessage(`
        Generate a title for a chat conversation based on the following first message: "${message}"
      `)
  ];

  const mistralModel = getMistralModel();
  if (mistralModel) {
    try {
      const response = await mistralModel.invoke(prompt);
      return response.content;
    } catch (error) {
      const errMessage = String(error?.message || "");
      if (errMessage.includes("Status 401") || errMessage.includes("Invalid API Key")) {
        console.warn("Mistral API key is invalid. Falling back to Gemini for chat title generation.");
      } else {
        console.warn("Mistral title generation failed. Falling back to Gemini.", errMessage);
      }
    }
  }

  try {
    const geminiModel = getGeminiModel();
    const response = await geminiModel.invoke(prompt);
    return response.content;
  } catch {
    return createFallbackTitle(message);
  }
}