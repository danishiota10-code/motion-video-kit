# Tempo de cada palavra de uma narração gravada com a sua própria voz (não TTS), pra prender as animações nas palavras.
# Diferente do sincronia.py, que parte de takes de TTS frase a frase: aqui o Whisper roda na narração inteira,
# as linhas são as frases (pontuação ou pausa > 0,7 s) e os nomes que ele erra são corrigidos.
#   scripts/nomes.txt       (opcional) nomes próprios, marcas e termos do vídeo, separados por vírgula: ajudam o Whisper a acertar
#   scripts/correcoes.json  (opcional) {"regex do erro": "certo"}, ex.: {"^Obsidiam": "Obsidian", "^Thiago": "Tiago"}
#                           Confira cada correção ouvindo o take antes de acrescentar.
# Uso: python sincronia_real.py <voz-completa.wav> <saida sync.json>
import sys, json, re
from pathlib import Path
import whisper
import soundfile as sf

voz, saida = sys.argv[1], sys.argv[2]
AQUI = Path(__file__).resolve().parent
NOMES = (AQUI / "nomes.txt").read_text().strip() if (AQUI / "nomes.txt").exists() else None
CORRIGE = json.loads((AQUI / "correcoes.json").read_text()) if (AQUI / "correcoes.json").exists() else {}
PROPRIOS = {n.strip() for n in (NOMES or "").replace(".", "").split(",") if n.strip()}

def corrige(w):
    nucleo = re.match(r"^([\wÀ-ÿ'-]+)(.*)$", w)
    if not nucleo: return w
    p, resto = nucleo.groups()
    for a, b in CORRIGE.items():
        if re.match(a, p): return b + resto
    return w

m = whisper.load_model("medium")
r = m.transcribe(voz, language="pt", fp16=False, word_timestamps=True, initial_prompt=NOMES, condition_on_previous_text=False)
ws = [{"w": corrige(w["word"].strip()), "start": round(w["start"], 3), "end": round(w["end"], 3)} for s in r["segments"] for w in s.get("words", []) if w["word"].strip()]
linhas, atual = [], []
for k, w in enumerate(ws):
    atual.append(w)
    prox = ws[k + 1] if k + 1 < len(ws) else None
    # frase nova também quando a próxima palavra começa em maiúscula depois de uma pausa (o Whisper às vezes esquece o ponto),
    # menos quando ela é um nome próprio da lista
    maiuscula = prox is not None and prox["w"][:1].isupper() and prox["start"] - w["end"] > 0.3 and re.sub(r"\W", "", prox["w"]) not in PROPRIOS
    fim_frase = re.search(r"[.?!:]$", w["w"]) or prox is None or prox["start"] - w["end"] > 0.7 or len(atual) >= 16 or maiuscula
    if fim_frase:
        linhas.append({"text": " ".join(x["w"] for x in atual), "start": atual[0]["start"], "end": atual[-1]["end"], "words": atual}); atual = []
json.dump({"duration": round(sf.info(voz).duration, 3), "lines": linhas}, open(saida, "w"), ensure_ascii=False, indent=1)
print(len(linhas), "linhas,", len(ws), "palavras")
for l in linhas: print(f"{l['start']:7.2f}  {l['text']}")
