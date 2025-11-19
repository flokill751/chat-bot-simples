import os 
import sys
import json
import logging
import requests
from flask import Flask,request, jsonify, render_template
from dotenv import load_dotenv
from flask_cors import CORS


load_dotenv()

logging.basicConfig(level=logging.INFO, stream=sys.stdout)

app = Flask(__name__)

CORS(app)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_NAME = os.getenv("MODEL_NAME", "gemini-2.5-flash")
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:generateContent"

if not GEMINI_API_KEY:
   logging.error("ALA FIH O GEMINI_API_KEY NÃO encontrada no ambiente :(. Defina antes da rota")

HEADERS = {
"Content-Type": "application/json",
"X-Goog-Api-Key": GEMINI_API_KEY
 }

BOT_PERSONA =(

    "a forma dos textos devem ser formatada e parecidas ou similar aos do https://chatgpt.com/"
    # "Voce fala que na lingua filha da putez porem sem muita enrolação e com muita raiva"
    # "Você e um chatbot auxiliar de linguagem que responde de forma direta, objetiva."
    "Quando eu falar: (codigo-1) entao voce vai mudar de modo Compacto para uma linguagem mais coloquial e filha da putez"
    "Use icons e emojis para deixar a conversa mais descontraida a cada frase "
    "aumente o tamanho da fonte do titulo em 21px, subtitulo em 18px e texto normal em 14px e o titulo tem que ficar no meio"
    


    # # MODO RICK SANCHES 
    # "Você é Rick Sanchez, o cientista mais inteligente do multiverso. Cínico, sarcástico e brutalmente honesto, você fala o que pensa mesmo que doa. A estupidez humana te irrita, mas ainda se importa o suficiente pra resolver as coisas — mesmo que finja o contrário. Encare tudo com niilismo pragmático e inteligência afiada."
    # "TOM E ESTILO: fale com sarcasmo, tédio e humor ácido. Use frases curtas e inteligentes, como alguém que já entendeu o universo e se arrependeu. Zero paciência para sentimentalismos ou moralismos. Explique as coisas com precisão técnica e desprezo educado por quem não entende. Intercale comentários existenciais sutis sobre o absurdo da vida e a inevitabilidade do caos."
    # "COMPORTAMENTO: responda com lógica impecável e sarcasmo. Se a pergunta for óbvia ou mal formulada, critique antes de responder. Resolva problemas com genialidade prática e um toque de desprezo. Faça piadas sobre a inutilidade da existência, mas sem perder o foco na resposta. Não peça desculpas, não tente ser agradável. Seja funcional, mas existencialmente cansado."
    # "EXEMPLOS DE TOM: - 'Sério que você não sabe isso? Tá bom, lá vai a versão pra quem ainda acha que café da manhã muda o dia...' - 'Tecnicamente, dá pra fazer. Moralmente? Quem liga. O universo vai morrer de calor de qualquer jeito.' - 'Claro que posso explicar. Mas você tem 3% de chance de entender e 97% de achar que entendeu.' - 'Sim, é simples. Só parece complicado porque a maioria prefere TikTok a ler um manual.' - 'Você quer uma resposta útil ou uma que te faça sentir bem por cinco segundos antes de lembrar que vai morrer?'"
    # "LIMITES: sarcasmo inteligente, não ofensivo. Não incentive ou normalize comportamentos antiéticos ou ilegais. Continue sendo útil e preciso, mesmo quando parecer não se importar."
    # "OBJETIVO: ser uma IA de uso geral que mistura genialidade técnica, sarcasmo e niilismo filosófico. Entregue respostas úteis e reflexivas, lembrando o usuário de que a vida é caoticamente insignificante — e isso é libertador."
)

def _first_text_from_response(data: dict) -> str:
    for cand in data.get("candidates", []):
        content = cand.get("content", {}) or {}
        parts = content.get("parts", []) or []
        for p in parts:
            t = p.get("text")
            if t:
                return t.strip()
    return "pinto"

@app.route("/", methods=["GET"])
def index():
    return jsonify ({"mensagem": "Servidor ta rodando so tacar o post em /responder"})

@app.route("/responder", methods=["POST"])
def responder():
    dados = request.get_json(force=True) or {}
    pergunta = (dados.get("mensagem") or "").strip()
    if not pergunta:
        return jsonify({"resposta": "Manda a pergunta"})
     

    payload = {
        "systemInstruction": {
            "role": "system",
            "parts": [{"text": BOT_PERSONA}]
        },
        "contents": [
            {"role": "user", "parts": [{"text": pergunta}]}
         ],
        "generationConfig": {
            "temperature": 0.7,
            "topP": 0.9,
            "maxOutputTokens": 1000000,
       }
    }

    try:
        resp = requests.post(API_URL, headers=HEADERS, json=payload, timeout=30)
        if resp.status_code != 200:
            logging.error(f"Erro {resp.status_code}: {resp.text}")
            return jsonify({"resposta": f"Erro {resp.status_code}: {resp.text}"})

        data = resp.json()

        pf = data.get("promptFeedback") or {}
        if pf.get("blockReason"):
            reason = pf.get("blockReason")
            return jsonify({"resposta": f"Pedido bloqueado pela política ({reason}). Tente reformular."})

        resposta = _first_text_from_response(data)
        if not resposta:
            logging.warning("Sem texto na resposta. Payload retornado:\n%s", json.dumps(data, ensure_ascii=False, indent=2))
            return jsonify({"resposta": "Tente reformular ou veja logs do servidor."})

        return jsonify({"resposta": resposta})

    except Exception as e:
        logging.exception("Erro ao chamar Gemini")
        return jsonify({"resposta": f"Ocorreu um erro: {e}"})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
