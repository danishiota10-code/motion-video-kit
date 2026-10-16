# Mixagem final: voz + trilha (−11 dB, abaixando ~3 dB sob a voz) + efeitos nos instantes da tela.
# Os instantes dos efeitos repetem as fórmulas das cenas em web/src/video/ (mesmas âncoras de palavra do sync.json).
# Num vídeo novo, reescreva só o bloco "efeitos do vídeo" lá embaixo, com as âncoras das suas cenas.
# Uso: python mixar.py <sync.json> <voz_final.wav> <trilha.wav> <pasta_sfx> <saida.wav>
import sys, json, re
import numpy as np, soundfile as sf

sync, voz_p, trilha_p, sfx_p, saida = sys.argv[1:6]
MUSICA_DB = float(sys.argv[6]) if len(sys.argv) > 6 else -11.0   # nível da trilha em relação à voz (−11 dB: a −20 dB some no alto-falante do celular)
DUCK = float(sys.argv[7]) if len(sys.argv) > 7 else 0.3          # quanto ela abaixa sob a voz (0,3 ≈ 3 dB)
S = json.load(open(sync)); L = S["lines"]; DUR = S["duration"]
def W(i, w):
    limpa = lambda s: re.sub(r"[^\w-]", "", s.lower())
    return next(p["start"] for p in L[i]["words"] if limpa(p["w"]).startswith(limpa(w)))

SR = 48000
voz, sr = sf.read(voz_p); voz = voz if voz.ndim == 1 else voz.mean(1); assert sr == SR
N = int(DUR * SR)
voz = np.pad(voz, (0, max(0, N - len(voz))))[:N]
mus, sr2 = sf.read(trilha_p); assert sr2 == SR
mus = np.pad(mus, ((0, max(0, N - len(mus))), (0, 0)))[:N]

# ducking: envelope da voz suavizado (300 ms) → a trilha abaixa até 6 dB
k = int(0.3 * SR)
env = np.convolve(np.abs(voz), np.ones(k) / k, "same")
duck = 1 - DUCK * np.clip(env / 0.03, 0, 1)
mix = voz[:, None] * np.ones((1, 2)) + mus * 10 ** (MUSICA_DB / 20) * duck[:, None]

sfx = {n: sf.read(f"{sfx_p}/{n}.wav")[0] for n in ("tic", "whoosh", "ding", "nasce")}
def put(nome, t, g=1.0):
    x = sfx[nome]; i = int(t * SR)
    if i < 0 or i >= N: return
    n = min(len(x), N - i); mix[i:i + n] += x[:n] * g

# ---- efeitos do vídeo (exemplo: scripts/roteiro-exemplo.json) ----
# câmera atravessando de uma cena pra outra (a troca acontece ~0,45 s antes de cada frase)
for i in range(1, len(L)): put("whoosh", L[i]["start"] - 0.5, 0.8)
# a cena da página web vira resultado
put("ding", W(1, "página") - 0.1, 0.55)
# as palavras que acendem na cena 3
for w in ("animação", "palavra"): put("tic", W(3, w) - 0.02, 0.7)
# o fechamento
put("nasce", L[5]["start"] - 0.4, 0.8)

mix *= 10 ** (-1 / 20) / np.max(np.abs(mix))
sf.write(saida, mix.astype(np.float32), SR, subtype="PCM_16")
print("ok", saida, round(DUR, 2), "s")
