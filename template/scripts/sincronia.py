# Tempo de cada palavra do voiceover, pra prender as animações da página web nas palavras.
# Limites de frase vêm da montagem (take + pausa), palavras do Whisper em cada take
# (com rateio proporcional quando a contagem não bate). Escreve o JSON da página e o áudio da voz com o silêncio de abertura.
# Uso: ROTEIRO=scripts/roteiro.json python sincronia.py <takes.json> <pasta_takes> <voz_tratada.wav> <saida.json> <voz_final.wav>
import sys, os, json, re
from pathlib import Path
import numpy as np, soundfile as sf, whisper

HEAD, TAIL = 0.8, 5.0  # silêncio antes da primeira frase e depois da última (s); o fim segura o cartão final
escolhas = json.loads(Path(sys.argv[1]).read_text())
pasta, voz, saida, voz_final = Path(sys.argv[2]), sys.argv[3], Path(sys.argv[4]), sys.argv[5]
roteiro = json.loads(Path(os.environ["ROTEIRO"]).read_text())

m = whisper.load_model("small")
linhas, t = [], HEAD
for (i, _n, nome, _txt), item in zip(escolhas, roteiro):
    dur = sf.info(str(pasta / nome)).duration
    alvo = item["tela"].split()
    r = m.transcribe(str(pasta / nome), fp16=False, language="pt", word_timestamps=True)
    ws = [w for s in r["segments"] for w in s.get("words", [])]
    if len(ws) == len(alvo):
        tempos = [(w["start"], w["end"]) for w in ws]
    else:
        a = ws[0]["start"] if ws else 0.05
        b = ws[-1]["end"] if ws else dur - 0.05
        pesos = np.array([len(re.sub(r"\W", "", p)) + 1 for p in alvo], float)
        cortes = a + (b - a) * np.concatenate([[0], np.cumsum(pesos) / pesos.sum()])
        tempos = list(zip(cortes[:-1], cortes[1:]))
    words = [{"w": p, "start": round(t + s, 3), "end": round(t + e, 3)} for p, (s, e) in zip(alvo, tempos)]
    linhas.append({"text": " ".join(alvo), "start": words[0]["start"], "end": words[-1]["end"], "words": words})
    print(f"{i:02d} {'whisper' if len(ws) == len(alvo) else 'proporcional'} {words[0]['start']:6.2f}  {' '.join(alvo)[:60]}")
    t += dur + item["pausa"]

v, sr = sf.read(voz)
v = v if v.ndim == 1 else v.mean(1)
final = np.concatenate([np.zeros(int(HEAD * sr)), v, np.zeros(int(TAIL * sr))])
sf.write(voz_final, final.astype(np.float32), sr, subtype="PCM_16")
dur = len(final) / sr
saida.write_text(json.dumps({"duration": round(dur, 3), "lines": linhas}, ensure_ascii=False, indent=1))
print("duração", round(dur, 2), "s")
