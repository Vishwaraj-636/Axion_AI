import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { useChat } from '../hook/useChat'
import ReactMarkdown from 'react-markdown'

const DashBoard = () => {
  const chat = useChat();
  const [chatInput, setChatInput] = useState('');

  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    chat.initializeSocketConnection()
    chat.handleGetChats()
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedMessage = chatInput.trim();
    if (!trimmedMessage) return;

    chat.handleSendMessage(trimmedMessage, currentChatId);
    setChatInput('');
  }
  const openChat = (chatId) => {
    chat.handleOpenChat(chatId);
  }

  return (
    <main className='min-h-screen w-full bg-[#07090f] p-3 text-white md:p-5'>
      <section className="mx-auto flex min-h-[calc(100vh-1.5rem)] w-full gap-4 rounded-3xl  p-3 sm:p-5">
        <div className="grid w-full gap-3 lg:grid-cols-[260px_1fr]">
          <aside className=" hidden h-full shrink-0 flex-col rounded-3xl border border-white/55 bg-[#080b12] p-4 md:flex">
            <h1 className='mb-5 text-3xl font-semibold tracking-tight'>Axion</h1>

            <div className="space-y-2">
              {Object.values(chats).map((chat, index) => (
                <button
                  onClick={()=>{openChat(chat.id)}}
                  key={index}
                  type='button'
                  className='w-full cursor-pointer rounded-2xl border-2 border-neutral-200/80 bg-neutral-900/80 px-5 py-3 text-xl text-neutral-100 transition hover:-translate-y-0.5 hover:bg-neutral-800 font-mono'
                >
                  {chat.title}
                </button>
              ))}
            </div>
          </aside>



          <section className="relative  flex h-full min-w-0 flex-1 flex-col gap-4">

            <div className='messages flex-1 space-y-4 overflow-y-auto pr-1 pb-32'>
              {chats[currentChatId]?.messages.map((msg, index) => (
                <div
                  key={index}
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm md:text-base ${msg.role === "user"
                    ? "ml-auto rounded-br-none bg-white/12 text-white"
                    : "rounded-tl-none bg-[#0f1626] text-white/90"
                    }`}
                >
                  {msg.role === "ai" ? (
                    <div className="leading-relaxed">
                      <ReactMarkdown>{String(msg.content || "")}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <footer className="rounded-3xl w-full absolute bottom-2 border border-white/60 bg-[#080b12] p-4 md:p-5">
              <form className="flex items-center gap-3" onSubmit={handleSubmit}>
                <input
                  id="text"
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 rounded-2xl border-2 border-neutral-200/80 bg-neutral-900/80 px-5 py-3 text-center text-xl text-neutral-100 placeholder:text-neutral-300/80 outline-none transition focus:ring-2 focus:ring-neutral-200/60 font-mono"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="rounded-2xl border-2 border-neutral-200/80 bg-neutral-900/80 px-5 py-3 text-xl text-neutral-100 transition hover:-translate-y-0.5 hover:bg-neutral-800 font-mono"
                >
                  Send
                </button>
              </form>
            </footer>
          </section>
        </div>
      </section>
    </main>
  )
}

export default DashBoard
