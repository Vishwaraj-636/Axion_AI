import { tavily } from "@tavily/core";

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

export const searchInternet = async ({ query }) => {
  const response = await tvly.search(query, {
    maxResults: 5,
    searchDepth: "basic"
  });


  return JSON.stringify(response.results);
};