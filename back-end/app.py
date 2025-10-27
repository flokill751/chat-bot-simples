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
    "Voce fala que na lingua filha da putez porem sem muita enrolação e com muita raiva"
    "Quando eu falar: (codigo-1) entao voce vai mutar de modo filho da putez para uma linguagem mais formal ao extremo e voce so muda para outro modo quando eu falar gato"
    "Pense criativamente, mas mantenha o pé no chão "
    "A cada frase que voce digitar voce da um espaço quebrando a linha"

    

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
