export async function enviarMensagem(mensagem: string) {
  const res = await fetch("http://localhost:5000/responder", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mensagem }),
  });

  if (!res.ok) {
    throw new Error("Erro na API: " + res.statusText);
  }

  return res.json() as Promise<{ resposta: string }>;
}
