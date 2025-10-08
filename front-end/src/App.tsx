import { useState, useRef, useEffect } from "react";
import SidebarDrawer from "./componets/siderBar/SidebarDrawer"; // Caminho corrigido
import { enviarMensagem } from "./api";
import { useTheme } from "next-themes";
import { Icon } from "@iconify/react";
import { Particles } from "./componets/background/Pontinho";

interface Mensagem {
  id: string;
  autor: string;
  texto: string;
  timestamp?: string;
}

interface Conversa {
  titulo: string;
  mensagens: Mensagem[];
  dataCriacao: string;
  ultimoAcesso?: string;
}

export default function App() {
  const [mensagem, setMensagem] = useState("");
  const [conversaAtual, setConversaAtual] = useState<number>(0);
  const [conversasList, setConversasList] = useState<string[]>(["Chat atual"]);
  const [todasConversas, setTodasConversas] = useState<Conversa[]>([
    {
      titulo: "Chat atual",
      mensagens: [],
      dataCriacao: new Date().toISOString()
    }
  ]);

  const mensagensEndRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [color, setColor] = useState("#ffffff");

  const conversa = todasConversas[conversaAtual]?.mensagens || [];

  useEffect(() => {
    setColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
  }, [resolvedTheme]);

  useEffect(() => {
    mensagensEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversa]);

  // Gerar ID único para mensagens
  const gerarId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    const conversasSalvas = localStorage.getItem('conversas');
    if (conversasSalvas) {
      const parsedConversas = JSON.parse(conversasSalvas);
      setTodasConversas(parsedConversas);
      setConversasList(parsedConversas.map((c: Conversa) => c.titulo));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('conversas', JSON.stringify(todasConversas));
  }, [todasConversas]);

  const handleEnviar = async () => {
    if (!mensagem.trim()) return;

    const novaMensagem: Mensagem = {
      id: gerarId(), // ID único
      autor: "Você",
      texto: mensagem,
      timestamp: new Date().toISOString()
    };

    setTodasConversas(prev => {
      const novasConversas = [...prev];
      if (!novasConversas[conversaAtual]) {
        novasConversas[conversaAtual] = {
          titulo: conversasList[conversaAtual],
          mensagens: [novaMensagem],
          dataCriacao: new Date().toISOString(),
          ultimoAcesso: new Date().toISOString()
        };
      } else {
        novasConversas[conversaAtual] = {
          ...novasConversas[conversaAtual],
          mensagens: [...novasConversas[conversaAtual].mensagens, novaMensagem],
          ultimoAcesso: new Date().toISOString()
        };
      }
      return novasConversas;
    });

    setMensagem("");

    try {
      const resposta = await enviarMensagem(mensagem);
      const respostaAI: Mensagem = {
        id: gerarId(), // ID único
        autor: "Kimera",
        texto: resposta.resposta,
        timestamp: new Date().toISOString()
      };

      setTodasConversas(prev => {
        const novasConversas = [...prev];
        novasConversas[conversaAtual] = {
          ...novasConversas[conversaAtual],
          mensagens: [...novasConversas[conversaAtual].mensagens, respostaAI],
          ultimoAcesso: new Date().toISOString()
        };
        return novasConversas;
      });
    } catch (err) {
      const mensagemErro: Mensagem = {
        id: gerarId(), // ID único
        autor: "Erro",
        texto: String(err),
        timestamp: new Date().toISOString()
      };

      setTodasConversas(prev => {
        const novasConversas = [...prev];
        novasConversas[conversaAtual] = {
          ...novasConversas[conversaAtual],
          mensagens: [...novasConversas[conversaAtual].mensagens, mensagemErro],
          ultimoAcesso: new Date().toISOString()
        };
        return novasConversas;
      });
    }
  };

  const handleNovoChat = () => {
    const novoIndex = todasConversas.length;
    const novoChatTitle = `Chat ${novoIndex + 1}`;

    const novaConversa: Conversa = {
      titulo: novoChatTitle,
      mensagens: [{
        id: gerarId(), // ID único
        autor: "Kimera",
        texto: `Bem-vindo ao ${novoChatTitle}! Como Não posso ajudar?`,
        timestamp: new Date().toISOString()
      }],
      dataCriacao: new Date().toISOString(),
      ultimoAcesso: new Date().toISOString()
    };

    setTodasConversas(prev => [...prev, novaConversa]);
    setConversasList(prev => [...prev, novoChatTitle]);
    setConversaAtual(novoIndex);
  };

  const handleSelecionarConversa = (index: number) => {
    setConversaAtual(index);

    setTodasConversas(prev => {
      const novasConversas = [...prev];
      if (novasConversas[index]) {
        novasConversas[index] = {
          ...novasConversas[index],
          ultimoAcesso: new Date().toISOString()
        };
      }
      return novasConversas;
    });
  };

  return (
    <div className="flex h-screen font-sans bg-gray-900 text-white p-2">
      {/* Sidebar */}
      <SidebarDrawer
        conversasList={conversasList}
        onNovoChat={handleNovoChat}
        onSelecionarConversa={handleSelecionarConversa}
        conversaAtual={conversaAtual}
      />

      <main className="flex-1 flex flex-col bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 mx-2 relative overflow-hidden">
        {/* Fundo com partículas */}
        <Particles
          quantity={350}
          color="#c57676ff"
          size={1}
          staticity={45}
          ease={80}
          className="opacity-85"
        />

        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 relative z-10">
          {conversa.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-[70%] p-4 rounded-2xl break-words shadow-md flex ${msg.autor === "Você"
                ? "bg-gray-700 self-end ml-auto"
                : "bg-gray-800 self-start mr-auto"
                }`}
            >
              {msg.autor !== "Você" && (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold shrink-0">
                  K
                </div>
              )}
              <div className={msg.autor !== "Você" ? "ml-2" : ""}>
                <strong className="block mb-1 text-sm opacity-80">
                  {msg.autor}
                </strong>
                {msg.texto}
              </div>
            </div>
          ))}
          <div ref={mensagensEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10 flex bg-gray-900/50 backdrop-blur-sm relative z-10">
          <div className="flex flex-1 rounded-full bg-white/10 border border-white/20 overflow-hidden">
            <input
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEnviar()}
              placeholder="Mande mensagem para a Kimera"
              className="flex-1 p-3 bg-transparent text-white focus:outline-none placeholder-white/60"
            />
            <button
              onClick={handleEnviar}
              className="px-6 bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center justify-center"
            >
              <Icon icon="lucide:arrow-big-right" className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
