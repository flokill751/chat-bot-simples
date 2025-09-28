import { useState, useRef, useEffect } from "react";
import { enviarMensagem } from "../../api";

function Chat() {
  const [mensagem, setMensagem] = useState("");
  const [conversa, setConversa] = useState<{ autor: string; texto: string }[]>([]);
  const mensagensEndRef = useRef<HTMLDivElement>(null);

  // Scroll automático para a última mensagem
  useEffect(() => {
    mensagensEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversa]);

  const handleEnviar = async () => {
    if (!mensagem.trim()) return;

    setConversa((prev) => [...prev, { autor: "Você", texto: mensagem }]);
    setMensagem(""); // limpa input

    try {
      const resposta = await enviarMensagem(mensagem); 
      setConversa((prev) => [
        ...prev,
        { autor: "bot", texto: resposta.resposta }
      ]);
    } catch (err) {
      setConversa((prev) => [
        ...prev,
        { autor: "Erro", texto: String(err) }
      ]);
    }
  };

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100">
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {conversa.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded max-w-xs ${
              msg.autor === "Você"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-300 self-start"
            }`}
          >
            <strong>{msg.autor}: </strong>{msg.texto}
          </div>
        ))}
        <div ref={mensagensEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleEnviar()}
          className="flex-1 p-2 border rounded"
          placeholder="Digite sua mensagem..."
        />
        <button
          onClick={handleEnviar}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

export default Chat;
