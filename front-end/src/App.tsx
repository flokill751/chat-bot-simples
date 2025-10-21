"use client"

import { useState, useRef, useEffect } from "react" // Caminho corrigido
import { useTheme } from "next-themes"
import { Particles } from "./componets/background/Pontinho"
import { Tsteinput } from "./componets/inputs/testInput"
import SidebarDrawer from "./componets/siderBar/SidebarDrawer"
// import { SidebarAcenty } from "./componets/siderBar/SiderBarAcenty"
// import { Vortex } from "./componets/background/vortex"

interface Mensagem {
  id: string
  autor: string
  texto: string
  timestamp?: string
}

interface Conversa {
  titulo: string
  mensagens: Mensagem[]
  dataCriacao: string
  ultimoAcesso?: string
}

export default function App() {
  // const [mensagem, setMensagem] = useState("")
  const [conversaAtual, setConversaAtual] = useState<number>(0)
  const [conversasList, setConversasList] = useState<string[]>(["Chat atual"])
  const [todasConversas, setTodasConversas] = useState<Conversa[]>([
    {
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
  }, [conversa])

  useEffect(() => {
    const conversasSalvas = localStorage.getItem("conversas")
    if (conversasSalvas) {
      const parsedConversas = JSON.parse(conversasSalvas)
      setTodasConversas(parsedConversas)
      setConversasList(parsedConversas.map((c: Conversa) => c.titulo))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("conversas", JSON.stringify(todasConversas))
  }, [todasConversas])

  const handleNovoChat = () => {
    const novoIndex = todasConversas.length
    const novoChatTitle = `Chat ${novoIndex + 1}`

    const novaConversa: Conversa = {
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
    setConversasList((prev) => [...prev, novoChatTitle])
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
       {/* Side bar */}

         {/* Opção -1 Acenty incompleto*/}
      {/* <SidebarAcenty 
        conversasList={conversasList}
        onNovoChat={handleNovoChat}
        onSelecionarConversa={handleSelecionarConversa}
        conversaAtual={conversaAtual}
      /> */}

      {/* Opção -2 Drawer */}
      <SidebarDrawer
        conversasList={conversasList}
        onNovoChat={handleNovoChat}
        onSelecionarConversa={handleSelecionarConversa}
        conversaAtual={conversaAtual}
      />

      <main className="flex-1 flex flex-col bg-gray-900 backdrop-blur-2xl rounded-2xl border border-white/10 mx-2 relative overflow-hidden">
        {/* Background papai */}

        {/* Opção -1 Vortex */}
        {/* <Vortex className="absolute inset-0 z-0" /> */}

        {/* Opção -2 Particulas */}
        <Particles quantity={350} color="#c57676ff" size={1} staticity={45} ease={80} className="opacity-85" />

        {/* Mensagens */}
        
        <Particles quantity={350} color="#c57676ff" size={1} staticity={45} ease={80} className="opacity-85" />
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 relative z-10">
          {conversa.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-[70%] p-4 rounded-2xl break-words shadow-md flex ${
                msg.autor === "Você" ? "bg-gray-700 self-end ml-auto" : "bg-gray-800 self-start mr-auto"
              }`}
            >
              {msg.autor !== "Você" && (
                <div className="w-8 h-8 rounded-full bg-black-500 flex items-center justify-center text-sm font-bold shrink-0">
                  K
                </div>
              )}
              <div className={msg.autor !== "Você" ? "ml-2" : ""}>
                <strong className="block mb-1 text-sm opacity-80">{msg.autor}</strong>
                {msg.texto}
              </div>
            </div>
          ))}
          <div ref={mensagensEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10 flex bg-gray-900/50 backdrop-blur-sm relative z-10">
          <Tsteinput
            conversaAtual={conversaAtual}
            todasConversas={todasConversas}
            setTodasConversas={setTodasConversas}
          />
        </div>
      </main>
    </div>
  )
}
