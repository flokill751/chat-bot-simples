import { useState, useRef, useEffect } from "react";
import SidebarDrawer from "./componets/siderBar/SidebarDrawer";
import { enviarMensagem } from "./api";

export default function App() {
  const [mensagem, setMensagem] = useState("");
  const [conversa, setConversa] = useState<{ autor: string; texto: string }[]>([]);
  const [conversasList, setConversasList] = useState<string[]>(["Chat atual"]);
  const [conversaAtual, setConversaAtual] = useState<number>(0); // Adicionei esta linha
  const mensagensEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mensagensEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversa]);

  const handleEnviar = async () => {
    if (!mensagem.trim()) return;

    setConversa((prev) => [...prev, { autor: "Você", texto: mensagem }]);
    setMensagem("");

    try {
      const resposta = await enviarMensagem(mensagem);
      setConversa((prev) => [...prev, { autor: "Kimera.UIA", texto: resposta.resposta }]);
    } catch (err) {
      setConversa((prev) => [...prev, { autor: "Erro", texto: String(err) }]);
    }
  };

  const handleNovoChat = () => {
    setConversa([]);
    const novoIndex = conversasList.length;
    setConversasList((prev) => [...prev, `Chat ${prev.length + 1}`]);
    setConversaAtual(novoIndex); // Atualiza a conversa atual
  };

  // Adicionei esta função para lidar com a seleção de conversas
  const handleSelecionarConversa = (index: number) => {
    setConversaAtual(index);
    // Aqui você pode adicionar lógica para carregar a conversa selecionada
    // Por exemplo, carregar do localStorage ou de um estado global
    setConversa([{
      autor: "Kimera.UIA",
      texto: `Bem-vindo de volta ao ${conversasList[index]}! Como posso ajudar?`
    }]);
  };

  return (
    <div className="flex h-screen font-sans bg-gray-900 text-white p-2">
      {/* Sidebar fixa */}
      <SidebarDrawer
        conversasList={conversasList}
        onNovoChat={handleNovoChat}
        onSelecionarConversa={handleSelecionarConversa}
        conversaAtual={conversaAtual}
      />

      {/* Chat principal */}
      <main className="flex-1 flex flex-col bg-gray-900 rounded-2xl border border-gray-700 mx-2">
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
          {conversa.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[70%] p-4 rounded-2xl break-words shadow-md ${msg.autor === "Você"
                ? "bg-gray-700 self-end ml-auto"
                : "bg-gray-800 self-start mr-auto flex items-start gap-2"
                }`}
            >
              {msg.autor !== "Você" && (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
                  A
                </div>
              )}
              <div>
                <strong className="block mb-1 text-sm opacity-80">{msg.autor}</strong>
                {msg.texto}
              </div>
            </div>
          ))}
          <div ref={mensagensEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-700 flex bg-gray-900">
          <div className="flex flex-1 rounded-full bg-gray-800 border border-gray-600 overflow-hidden">
            <input
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEnviar()}
              placeholder="Send a message to AcmeAI"
              className="flex-1 p-3 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleEnviar}
              className="px-6 bg-blue-600 hover:bg-blue-500 text-white"
            >
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}