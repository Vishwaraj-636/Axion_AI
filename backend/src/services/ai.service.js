import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-3.1-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});


export async function testAI(req, res) {
  model.invoke("what is ai explained under 100 words?").then((response) => {
    console.log(response.text)
  })
}