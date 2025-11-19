import { useState, useRef, useEffect } from "react"
import { useTheme } from "next-themes"
import { Particles } from "../components/backgrounds/Pontinho"
import { Tsteinput } from "../components/inputs/TestInput"
import SidebarDrawer from "../components/navigation/SidebarDrawer"
import type { Conversa, } from "../types/chat"
import MarkdownRenderer from "../components/display/MarkdownRender"
import Markdown from "react-markdown"
// import ReactMarkdown from "react-markdown"

export default function App() {
  const [conversaAtual, setConversaAtual] = useState<number>(0)
  const [carregando, setcarregando] = useState(false)

  const [todasConversas, setTodasConversas] = useState<Conversa[]>([
    {
      id: 0,  // id obrigatório
      titulo: "Chat atual",
      mensagens: [],
      dataCriacao: new Date().toISOString(),
    },
  ])

  
  const mensagensEndRef = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const [color, setColor] = useState("#ffffff")

  const conversa = todasConversas[conversaAtual]?.mensagens || []

  useEffect(() => {
    setColor(resolvedTheme === "dark" ? "#ffffff" : "#000000")
  }, [resolvedTheme])

  useEffect(() => {
    mensagensEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversa, carregando])

  useEffect(() => {
    const conversasSalvas = localStorage.getItem("conversas")
    if (conversasSalvas) {
      setTodasConversas(JSON.parse(conversasSalvas))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("conversas", JSON.stringify(todasConversas))
  }, [todasConversas])

  const handleNovoChat = () => {
    const novoIndex = todasConversas.length
    const novoChatTitle = `Chat ${novoIndex + 1}`

    const novaConversa: Conversa = {
      id: Date.now(),
      titulo: novoChatTitle,
      mensagens: [
        {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          autor: "Kimera",
          texto: `Bem-vindo ao ${novoChatTitle}! Como Não posso ajudar?`,
          timestamp: new Date().toISOString(),
        },
      ],
      dataCriacao: new Date().toISOString(),
      ultimoAcesso: new Date().toISOString(),
    }

    setTodasConversas((prev) => [...prev, novaConversa])
    setConversaAtual(novoIndex)
  }

  const handleSelecionarConversa = (index: number) => {
    setConversaAtual(index)

    setTodasConversas((prev) => {
      const novasConversas = [...prev]
      if (novasConversas[index]) {
        novasConversas[index] = {
          ...novasConversas[index],
          ultimoAcesso: new Date().toISOString(),
        }
      }
      return novasConversas
    })
  }

  return (
    <div className="flex h-screen font-sans bg-gray-900 text-white p-2">

      <SidebarDrawer
        conversasList={todasConversas}
        onNovoChat={handleNovoChat}
        onSelecionarConversas={handleSelecionarConversa}
        conversaAtual={conversaAtual}
      />


      <main className="flex-1 flex flex-col bg-gray-900 backdrop-blur-2xl rounded-2xl border border-white/10 mx-2 relative overflow-hidden">
        <Particles quantity={350} color="#c57676ff" size={1} staticity={45} ease={80} className="opacity-85" />

        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 relative z-10">
          
          {conversa.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start ${msg.autor === "Você" ? "justify-end" : "justify-start"}`}
            >
              {msg.autor !== "Você" && (
                <div className="w-8 h-8 rounded-full bg-b-500 flex items-center justify-center text-sm font-bold shrink-0">
                  K
                </div>
              )}

              <div
                className={`p-4 rounded-2xl break-words shadow-md w-fit max-w-[45%] 
                  ${msg.autor === "Você" ? "bg-gray-700 ml-2" : "bg-gray-800 ml-2"
                  }`}
              >
                <strong className="block mb-1 text-sm opacity-80">{msg.autor}</strong>

          
                <MarkdownRenderer content={msg.texto} />  
          

              </div>
            </div>
          ))}

          {carregando && (
            <div className="flex items-start justify-start">
              <div className="w-8 h-8 rounded-full bg-b-500 flex items-center justify-center text-sm font-bold shrink-0">K</div>
              <div className="p-4 rounded-2xl shadow-md bg-gray-800 ml-2 max-w-[45%]">
                <strong className="block mb-1 text-sm opacity-800">Kimera</strong>
                <CarregandoDots text="Pensando" />
              </div>
            </div>
          )}

          <div ref={mensagensEndRef} />
        </div>

        <div className="p-4 border-t border-white/10 flex bg-gray-900/50 backdrop-blur-sm relative z-10">
          <Tsteinput
            conversaAtual={conversaAtual}
            todasConversas={todasConversas}
            setTodasConversas={setTodasConversas}
            setcarregando={setcarregando}
          />
        </div>
      </main>

    </div>
  )

  function CarregandoDots({ text = "Pensando" }: { text?: string }) {
    return (
      <div className="inline-flex items-center gap-2">
        <span className="opacity-80">{text}</span>
        <span className="flex gap-1" aria-label="digitando">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" />
        </span>
      </div>
    );
  }
}
