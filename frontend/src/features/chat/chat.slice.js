import { createSlice } from "@reduxjs/toolkit";


const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: {},
    currentChatId: null,
    isLoading: false,
    isChatsLoading: false,
    error: null,
  },
  reducers: {
    createNewChat: (state, action) => {
      const { chatId, title } = action.payload
      state.chats[chatId] = {
        id: chatId,
        title,
        messages: [],
        lastUpdated: new Date().toISOString(),
      }
    },
    addNewMessage: (state, action) => {
      const { chatId, content, role } = action.payload
      if (!state.chats[chatId]) {
        state.chats[chatId] = {
          id: chatId,
          title: "New Chat",
          messages: [],
          lastUpdated: new Date().toISOString(),
        }
      }
      state.chats[chatId].messages.push({ content, role })
    },
    setChats: (state, action) => {
      state.chats = action.payload
    },
    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setIsChatsLoading: (state, action) => {
      state.isChatsLoading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    addMessages: (state, action) => {
      const { chatId, messages } = action.payload
      if (!state.chats[chatId]) {
        state.chats[chatId] = {
          id: chatId,
          title: "New Chat",
          messages: [],
          lastUpdated: new Date().toISOString(),
        }
      }
      state.chats[chatId].messages.push(...messages)
    },
    removeChat: (state, action) => {
      const chatId = action.payload
      delete state.chats[chatId]
      if(state.currentChatId === chatId){
        state.currentChatId = null
      }
    }
  }
})

export const { setChats, setCurrentChatId, setIsLoading, setIsChatsLoading, setError, createNewChat, addNewMessage, addMessages, removeChat } = chatSlice.actions

export default chatSlice.reducer