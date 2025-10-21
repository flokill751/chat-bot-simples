"use client"

import { PlaceholdersAndVanishInput } from "../../components/ui/placeholders-and-vanish-input"
import type React from "react"
import { useState } from "react"
import { enviarMensagem } from "../../api"


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

interface TsteinputProps {
  conversaAtual: number
  todasConversas: Conversa[]
  setTodasConversas: React.Dispatch<React.SetStateAction<Conversa[]>>
}

export function Tsteinput({ conversaAtual, todasConversas, setTodasConversas }: TsteinputProps) {
  const [mensagem, setMensagem] = useState("")
  const [carregando, setCarregando] = useState(false)

  const placeholders = [
    "Permita-me dirimir qualquer questão exposta.",
    "Cala a boca e fala logo o que tu quer, tá ligado?",
    "Oxente, arreda esse papinho chato,que nem tô querendo escutar não!",
    "Tchê, precisando de uma mão? Só chegar e largar a pergunta!",
    "Se pique da dúvida, que eu tô pronta pra brocar na resposta.",
  ]

  const gerarId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  const handleEnviar = async () => {
    if (!mensagem.trim()) return
    setCarregando(true)
    

    const novaMensagem: Mensagem = {
      id: gerarId(),
      autor: "Você",
      texto: mensagem,
      timestamp: new Date().toISOString(),
      
    }



    setTodasConversas((prev) => {
      const novasConversas = [...prev]
      if (!novasConversas[conversaAtual]) {
        novasConversas[conversaAtual] = {
          titulo: `Chat ${conversaAtual + 1}`,
          mensagens: [novaMensagem],
          dataCriacao: new Date().toISOString(),
          ultimoAcesso: new Date().toISOString(),
        }
      } else {
        novasConversas[conversaAtual] = {
          ...novasConversas[conversaAtual],
          mensagens: [...novasConversas[conversaAtual].mensagens, novaMensagem],
          ultimoAcesso: new Date().toISOString(),
        }
      }
      return novasConversas
    })

    setMensagem("")

    try {
      const resposta = await enviarMensagem(mensagem)
      const respostaAI: Mensagem = {
        id: gerarId(),
        autor: "Kimera",
        texto: resposta.resposta,
        timestamp: new Date().toISOString(),
      }

      setTodasConversas((prev) => {
        const novasConversas = [...prev]
        novasConversas[conversaAtual] = {
          ...novasConversas[conversaAtual],
          mensagens: [...novasConversas[conversaAtual].mensagens, respostaAI],
          ultimoAcesso: new Date().toISOString(),
        }
        return novasConversas
      })
    } catch (err) {
      const mensagemErro: Mensagem = {
        id: gerarId(),
        autor: "Erro",
        texto: String(err),
        timestamp: new Date().toISOString(),
      }

      setTodasConversas((prev) => {
        const novasConversas = [...prev]
        novasConversas[conversaAtual] = {
          ...novasConversas[conversaAtual],
          mensagens: [...novasConversas[conversaAtual].mensagens, mensagemErro],
          ultimoAcesso: new Date().toISOString(),
        }
        return novasConversas 
      })
    } finally{
      setCarregando(false)
    }
  

  }

  return (
    <div className="flex flex-1 rounded-full border-white/20 overflow-hidden">
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        value={mensagem}
        onChange={(e) => setMensagem(e.target.value)}
        onSend={handleEnviar}
      />
     <button
        type="button"
        className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center disabled:opacity-60"
        disabled={carregando}
        onClick={handleEnviar}
      >
        {carregando && (
          <svg className="mr-3 size-5 animate-spin" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="4" fill="none" />
          </svg>
        )}
        {carregando? "Processing…" : "Enviar"}
      </button>
    </div>
  )
}
