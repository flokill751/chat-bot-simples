export interface Mensagem {
  id: string
  autor: string
  texto: string
  timestamp?: string
}

export interface Conversa {
  id: number
  titulo: string
  mensagens: Mensagem[]
  dataCriacao: string
  ultimoAcesso?: string
  }
