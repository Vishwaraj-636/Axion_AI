import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { useChat } from '../hook/useChat'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { RiArrowUpLine, RiMenu4Line } from "@remixicon/react";

const DashBoard = () => {
  const chat = useChat();
  const [chatInput, setChatInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    chat.handleOpenChat(chatId,chats);
  }

  return (
    <main className='h-screen w-full bg-[#000000]  text-white  flex flex-col'>
      <section className="mx-auto flex h-full w-full gap-4 overflow-hidden">
        <div className="flex h-full w-full gap-3 overflow-hidden">
          <aside
            className={`h-full shrink-0 flex-col bg-[#1E1F20] flex transition-all duration-300 overflow-hidden ${isSidebarOpen ? 'w-55 p-4' : 'w-12 p-2 items-center'}`}
          >

            <div className={`flex w-full mb-4 items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
              {isSidebarOpen && <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Axion</h1>}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="h-9 w-9 shrink-0 flex items-center justify-center rounded-full hover:bg-white/10"
              >
                <RiMenu4Line />
              </button>
            </div>

            {/* Chat list */}
            <div className={`w-full space-y-1 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              {Object.values(chats).map((chat, index) => (
                <button
                  onClick={() => { openChat(chat.id) }}
                  key={index}
                  type='button'
                  className='w-full truncate text-left cursor-pointer rounded-lg px-3 py-2 text-sm text-neutral-400 transition hover:bg-white/5 hover:text-white font-mono'
                >
                  {chat.title}
                </button>
              ))}
            </div>
          </aside>
          <section className="mx-auto flex h-full min-w-0 w-full max-w-4xl flex-col gap-4 overflow-hidden px-4 py-10">
            <div className='messages flex-1 space-y-4 overflow-y-auto pr-1'>
              {chats[currentChatId]?.messages.map((msg, index) => (
                <div
                  key={index}
                  className={`rounded-2xl px-3 py-2 text-sm ${msg.role === "user"
                    ? "max-w-[72%] ml-auto rounded-br-none bg-[#1E1F20] text-white "
                    : "max-w-[95%] rounded-tl-none bg-[#000000] text-white/90"
                    }`}
                >
                  {msg.role === "ai" ? (
                    <div className="leading-relaxed text-neutral-200">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          // Paragraphs
                          p: ({ node, ...props }) => <p className="mb-3 last:mb-0 leading-relaxed" {...props} />,

                          // Headings
                          h1: ({ node, ...props }) => <h1 className="mb-4 mt-6 text-2xl font-bold text-white" {...props} />,
                          h2: ({ node, ...props }) => <h2 className="mb-3 mt-5 text-xl font-bold text-white" {...props} />,
                          h3: ({ node, ...props }) => <h3 className="mb-2 mt-4 text-lg font-bold text-white" {...props} />,

                          // Lists
                          ul: ({ node, ...props }) => <ul className="mb-4 ml-6 list-outside list-disc marker:text-neutral-400" {...props} />,
                          ol: ({ node, ...props }) => <ol className="mb-4 ml-6 list-outside list-decimal marker:text-neutral-400" {...props} />,
                          li: ({ node, ...props }) => <li className="mb-1 pl-1" {...props} />,

                          // Code blocks & Inline code
                          code: ({ node, inline, className, children, ...props }) => {
                            const match = /language-(\w+)/.exec(className || '')
                            const isInline = inline || !match;
                            return !isInline ? (
                              <div className="my-4 overflow-hidden rounded-lg bg-[#000000] border border-white/10">
                                <div className="bg-white/5 px-4 py-1.5 text-xs text-neutral-400 font-mono flex justify-between">
                                  <span>{match ? match[1] : 'code'}</span>
                                </div>
                                <SyntaxHighlighter
                                  {...props}
                                  style={vscDarkPlus}
                                  language={match ? match[1] : 'text'}
                                  PreTag="div"
                                  customStyle={{ margin: 0, padding: '1rem', background: '#000000' }}
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              </div>
                            ) : (
                              <code className="rounded-md bg-white/10 px-1.5 py-0.5 text-sm font-mono text-pink-300" {...props}>
                                {children}
                              </code>
                            )
                          },

                          // Tables
                          table: ({ node, ...props }) => <div className="overflow-x-auto my-4 rounded-lg border border-white/10"><table className="w-full text-sm text-left text-neutral-300 border-collapse" {...props} /></div>,
                          thead: ({ node, ...props }) => <thead className="text-xs text-neutral-400 uppercase bg-white/5 border-b border-white/10" {...props} />,
                          tbody: ({ node, ...props }) => <tbody className="divide-y divide-white/10" {...props} />,
                          tr: ({ node, ...props }) => <tr className="hover:bg-white/5 transition-colors" {...props} />,
                          th: ({ node, ...props }) => <th className="px-4 py-3 font-medium border-r border-white/10 last:border-r-0" {...props} />,
                          td: ({ node, ...props }) => <td className="px-4 py-3 border-r border-white/10 last:border-r-0" {...props} />,

                          // Bold text
                          strong: ({ node, ...props }) => <strong className="font-semibold text-white" {...props} />,

                          // Links
                          a: ({ node, ...props }) => <a className="text-blue-400 underline underline-offset-2 hover:text-blue-300" target="_blank" rel="noreferrer" {...props} />,

                          // Blockquotes
                          blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-white/20 pl-4 italic text-neutral-300 my-4" {...props} />
                        }}
                      >
                        {String(msg.content || "")}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <footer className="shrink-0 rounded-3xl w-full bg-[#1E1F20] p-2 md:p-2 ">
              <form className="flex items-center gap-3" onSubmit={handleSubmit}>
                <input
                  id="text"
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  placeholder="Ask Axion"
                  autoComplete="off"
                  className="flex-1 rounded-2xl p-2 text-base text-neutral-100 placeholder:text-neutral-300/60 outline-none transition  font-mono"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="rounded-full bg-[#1a2e6a] p-2 text-base text-neutral-100 transition hover:scale-105 hover:bg-[#414d70]/60 font-mono"
                >
                  <RiArrowUpLine
                    // size={36} // set custom `width` and `height`
                    // color="red" // set `fill` color
                    className="my-icon" // add custom class name
                  />
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
