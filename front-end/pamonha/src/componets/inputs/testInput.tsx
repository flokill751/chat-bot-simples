"use client";

import { PlaceholdersAndVanishInput } from "../../components/ui/placeholders-and-vanish-input";
import React, { useState } from "react";


export function Tsteinput() {
  const [mensagem, setMensagem] = useState("");

  const placeholders = [
    "Permita-me dirimir qualquer questão exposta.",
    "Cala a boca e fala logo o que tu quer, tá ligado?",
    "Oxente, arreda esse papinho chato,que nem tô querendo escutar não!",
    "Tchê, precisando de uma mão? Só chegar e largar a pergunta!",
    "Se pique da dúvida, que eu tô pronta pra brocar na resposta.",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <div className="flex flex-1 rounded-full border-white/20 overflow-hidden">
 
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        value={mensagem}
        onChange={(e) => setMensagem(e.target.value)}
        onSend={(mensagem) => console.log("Enviou:", mensagem)}
      />
    </div>
  );
}
