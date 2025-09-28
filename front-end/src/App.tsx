import { useState } from "react"
import { FiSend, FiMenu } from "react-icons/fi"

interface Message {
  role: "user" | "bot"
  content: string
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "👋 Olá, eu sou o ChatBot! Pergunte-me qualquer coisa." },
  ])
  const [input, setInput] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSend = () => {
    if (!input.trim()) return

    const newMessage: Message = { role: "user", content: input }
    setMessages([...messages, newMessage])

    // resposta fake só pra UI
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "🤖 Resposta automática para: " + input },
      ])
    }, 800)

    setInput("")
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-gray-800 p-4 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform md:translate-x-0`}
      >
        <h2 className="text-xl font-bold mb-6">💬 Meus Chats</h2>
        <button className="w-full bg-blue-600 py-2 rounded mb-4 hover:bg-blue-500">
          + Novo Chat
        </button>
        <ul className="space-y-2">
          <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">Conversa 1</li>
          <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">Conversa 2</li>
        </ul>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="p-4 border-b border-gray-700 flex items-center md:hidden">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FiMenu size={24} />
          </button>
          <h1 className="ml-4 font-bold text-lg">ChatBot</h1>
        </header>

        {/* Área de mensagens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs md:max-w-md ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-700 text-gray-100 rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-700 bg-gray-800 flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 p-3 rounded-l-2xl bg-gray-700 text-white focus:outline-none"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 px-4 flex items-center justify-center rounded-r-2xl hover:bg-blue-500 transition"
          >
            <FiSend size={20} />
          </button>
        </div>
      </main>
    </div>
  )
}
