import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { useChat } from '../hook/useChat'
import { setCurrentChatId } from '../chat.slice'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { RiArrowUpLine, RiMenu4Line, RiAddLine, RiDeleteBinLine, RiLogoutBoxRLine, RiUserLine } from "@remixicon/react";
import { useAuth } from "../../auth/hook/use.auth";

const DashBoard = () => {
  const chat = useChat();
  const dispatch = useDispatch();
  const [chatInput, setChatInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const isLoading = useSelector((state) => state.chat.isLoading);
  const isChatsLoading = useSelector((state) => state.chat.isChatsLoading);
  const { user } = useSelector((state) => state.auth);
  const { handleLogout } = useAuth();

  const suggestions = [
    "Explain Quantum Computing in simple terms",
    "Write a haiku about artificial intelligence",
    "How do I center a div using Tailwind CSS?",
    "Give me a recipe for chocolate chip cookies"
  ];

  const handleSuggestionClick = (suggestion) => {
    chat.handleSendMessage(suggestion, currentChatId);
  }

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
    chat.handleOpenChat(chatId, chats);
  }

  const handleNewChat = () => {
    dispatch(setCurrentChatId(null));
  }

  return (
    <main className='h-screen w-full bg-[#1c1c1e] text-white/90 font-sans tracking-tight flex flex-col'>
      <section className="mx-auto flex h-full w-full overflow-hidden">
        <div className="flex h-full w-full overflow-hidden">
          {/* Sidebar */}
          <aside
            className={`h-full shrink-0 flex-col bg-[#252528]/80 backdrop-blur-xl border-r border-white/10 flex transition-all duration-300 overflow-hidden ${isSidebarOpen ? 'w-64 p-4' : 'w-16 p-2 items-center'}`}
          >
            <div className={`flex w-full mb-6 items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
              {isSidebarOpen && <h1 className="text-xl font-semibold tracking-tight text-white">Axion</h1>}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg hover:bg-white/10 transition text-neutral-400 hover:text-white"
              >
                <RiMenu4Line size={20} />
              </button>
            </div>

            {/* New Chat Button */}
            <div className={`mb-4 w-full transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <button
                onClick={handleNewChat}
                className="w-full flex items-center gap-2 px-3 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition text-sm font-medium shadow-sm"
              >
                <RiAddLine size={18} />
                <span>New Chat</span>
              </button>
            </div>

            {/* Chat list */}
            <div className={`w-full flex-1 overflow-y-auto space-y-1 pr-2 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              {isChatsLoading ? (
                // Skeleton Loader
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="w-full h-9 bg-white/5 animate-pulse rounded-xl mb-1"></div>
                ))
              ) : (
                Object.values(chats).map((c, index) => (
                  <div key={index} className={`flex items-center justify-between group rounded-xl transition px-1 ${currentChatId === c.id ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-neutral-400'}`}>
                    <button
                      onClick={() => { openChat(c.id) }}
                      type='button'
                      className='flex-1 truncate text-left cursor-pointer px-2 py-2 text-sm group-hover:text-white transition'
                    >
                      {c.title}
                    </button>
                    <button
                      onClick={() => chat.handleDeleteChat(c.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-neutral-500 hover:text-red-400 transition rounded-lg hover:bg-white/10"
                    >
                      <RiDeleteBinLine size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* User Profile & Logout */}
            <div className={`mt-auto pt-4 border-t border-white/10 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 shadow-sm">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-inner">
                    <RiUserLine size={14} className="text-white" />
                  </div>
                  <span className="text-sm font-medium truncate text-neutral-200">
                    {user?.username || 'User'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition"
                  title="Logout"
                >
                  <RiLogoutBoxRLine size={16} />
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="flex-1 flex flex-col h-full min-w-0 bg-[#1c1c1e]">
            {(!currentChatId || (chats[currentChatId] && chats[currentChatId].messages.length === 0)) ? (
              // Welcome Message Empty State
              <div className="flex-1 flex flex-col items-center justify-center px-4">
                <div className="h-20 w-20 mb-8 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/20">
                  <span className="text-4xl text-white">✨</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-semibold mb-3 text-white tracking-tight">How can I help you today?</h2>
                <p className="text-neutral-400 text-lg mb-8">Send a message to start chatting with Axion AI.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="p-4 rounded-xl border border-white/10 bg-[#252528]/80 hover:bg-white/10 text-left transition text-sm text-neutral-300 hover:text-white"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Messages List
              <div className='flex-1 overflow-y-auto px-4 py-8 md:px-12 lg:px-24 xl:px-48 space-y-6'>
                {chats[currentChatId]?.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`px-5 py-3.5 max-w-[85%] sm:max-w-[75%] text-[15px] leading-relaxed shadow-sm ${msg.role === "user"
                      ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm"
                      : "bg-transparent text-white/90 rounded-2xl"
                      }`}>
                      {msg.role === "ai" ? (
                        <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:p-0">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({ node, ...props }) => <p className="mb-4 last:mb-0" {...props} />,
                              h1: ({ node, ...props }) => <h1 className="mb-4 mt-6 text-2xl font-semibold text-white" {...props} />,
                              h2: ({ node, ...props }) => <h2 className="mb-3 mt-5 text-xl font-semibold text-white" {...props} />,
                              h3: ({ node, ...props }) => <h3 className="mb-2 mt-4 text-lg font-semibold text-white" {...props} />,
                              ul: ({ node, ...props }) => <ul className="mb-4 ml-6 list-outside list-disc text-neutral-300" {...props} />,
                              ol: ({ node, ...props }) => <ol className="mb-4 ml-6 list-outside list-decimal text-neutral-300" {...props} />,
                              li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                              code: ({ node, inline, className, children, ...props }) => {
                                const match = /language-(\w+)/.exec(className || '')
                                const isInline = inline || !match;
                                return !isInline ? (
                                  <div className="my-5 overflow-hidden rounded-xl border border-white/10 bg-[#151515]">
                                    <div className="bg-white/5 px-4 py-2 text-xs text-neutral-400 font-mono flex justify-between border-b border-white/5">
                                      <span>{match ? match[1] : 'code'}</span>
                                    </div>
                                    <SyntaxHighlighter
                                      {...props}
                                      style={vscDarkPlus}
                                      language={match ? match[1] : 'text'}
                                      PreTag="div"
                                      customStyle={{ margin: 0, padding: '1rem', background: 'transparent' }}
                                    >
                                      {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                  </div>
                                ) : (
                                  <code className="rounded-md bg-white/10 px-1.5 py-0.5 text-[13px] font-mono text-blue-300" {...props}>
                                    {children}
                                  </code>
                                )
                              },
                              table: ({ node, ...props }) => <div className="overflow-x-auto my-5 rounded-xl border border-white/10"><table className="w-full text-sm text-left text-neutral-300 border-collapse" {...props} /></div>,
                              thead: ({ node, ...props }) => <thead className="text-xs text-neutral-400 uppercase bg-white/5 border-b border-white/10" {...props} />,
                              tbody: ({ node, ...props }) => <tbody className="divide-y divide-white/10" {...props} />,
                              tr: ({ node, ...props }) => <tr className="hover:bg-white/5 transition-colors" {...props} />,
                              th: ({ node, ...props }) => <th className="px-4 py-3 font-medium border-r border-white/10 last:border-r-0" {...props} />,
                              td: ({ node, ...props }) => <td className="px-4 py-3 border-r border-white/10 last:border-r-0" {...props} />,
                              strong: ({ node, ...props }) => <strong className="font-semibold text-white" {...props} />,
                              a: ({ node, ...props }) => <a className="text-blue-400 hover:text-blue-300 underline underline-offset-4" target="_blank" rel="noreferrer" {...props} />,
                              blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-blue-500/50 pl-4 italic text-neutral-400 my-4" {...props} />
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
                  </div>
                ))}

                {isLoading && (
                  <div className="flex w-full justify-start">
                    <div className="px-5 py-4 bg-transparent rounded-2xl flex items-center gap-1.5 w-fit">
                      <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Input Footer */}
            <footer className="shrink-0 w-full px-4 pb-6 pt-2 md:px-12 lg:px-24 xl:px-48 bg-gradient-to-t from-[#1c1c1e] via-[#1c1c1e] to-transparent">
              <form
                className="flex items-center gap-3 bg-[#252528] border border-white/10 rounded-2xl p-1.5 shadow-sm transition-all focus-within:border-white/20 focus-within:ring-2 focus-within:ring-white/5"
                onSubmit={handleSubmit}
              >
                <input
                  id="text"
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  placeholder="Ask Axion..."
                  autoComplete="off"
                  className="flex-1 bg-transparent px-4 py-2.5 text-[15px] text-white placeholder:text-neutral-500 outline-none"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isLoading}
                  className="rounded-xl bg-white text-black p-2 transition-all hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center h-10 w-10 shrink-0"
                >
                  <RiArrowUpLine size={20} />
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
