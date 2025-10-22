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


  const placeholders = [
    "Permita-me dirimir qualquer questão exposta.",
    "Cala a boca e fala logo o que tu quer, tá ligado?",
    "Oxente, arreda esse papinho chato,que nem tô querendo escutar não!",
    "Tchê, precisando de uma mão? Só chegar e largar a pergunta!",
    "Se pique da dúvida, que eu tô pronta pra brocar na resposta.",
  ]

  const gerarId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  const handleEnviar = async (textoMensagem: string) => {
    if (!textoMensagem.trim()) return;

    const novaMensagem: Mensagem = {
      id: gerarId(),
      autor: "Você",
      texto: textoMensagem,
      timestamp: new Date().toISOString(),
    };

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

    setMensagem("");

    try {
      const resposta = await enviarMensagem(textoMensagem)
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
        return novasConversas;
      })
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
    
      </div>
    )
  
}

