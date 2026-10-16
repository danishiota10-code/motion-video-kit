# Trilha ambiente do vídeo, composta em código (sem música de terceiros, sem direitos).
# Pad de serras desafinadas com filtro passa-baixa lento, grave suave e um sino esparso em arpejo,
# tudo num reverb de cauda longa. Progressão calma em Ré: Dmaj9 → Bm9 → Gmaj9 → A6sus, 8 s cada.
# Uso: python trilha.py <saida.wav> [duracao_s]
import sys
import numpy as np
from scipy.signal import butter, sosfilt, sosfilt_zi, fftconvolve
import soundfile as sf

SR = 48000
saida = sys.argv[1]
DUR = float(sys.argv[2]) if len(sys.argv) > 2 else 84.0
CORTE = 1600   # base do passa-baixa do pad (Hz); era 900, abafado demais pro alto-falante do celular
SINO = 0.11
N = int(DUR * SR)
t = np.arange(N) / SR
rnd = np.random.default_rng(5)
hz = lambda m: 440 * 2 ** ((m - 69) / 12)

ACORDES = [  # notas MIDI do pad (voicing aberto) e a fundamental do grave
    ([50, 57, 61, 64, 66], 38),   # Dmaj9
    ([47, 54, 57, 61, 62], 35),   # Bm9 (add9)
    ([43, 50, 54, 57, 59], 31),   # Gmaj9
    ([45, 52, 54, 57, 59], 33),   # A6sus
]
PASSO = 8.0

def envelope_acorde(k):
    # cada acorde entra e sai com cruzamento de 2 s
    ini = k * PASSO
    e = np.clip((t - (ini - 1.0)) / 2.0, 0, 1) * np.clip(((ini + PASSO + 1.0) - t) / 2.0, 0, 1)
    return np.sin(e * np.pi / 2) ** 2

def serra(f, fase):
    x = (t * f + fase) % 1.0
    return 2 * x - 1

pad = np.zeros(N); grave = np.zeros(N)
n_acordes = int(np.ceil(DUR / PASSO)) + 1
for k in range(n_acordes):
    notas, raiz = ACORDES[k % len(ACORDES)]
    env = envelope_acorde(k)
    if env.max() == 0: continue
    for m in notas:
        for d in (-0.07, 0.0, 0.06):  # três vozes desafinadas por nota = coro
            pad += env * serra(hz(m) * 2 ** (d / 12), rnd.random()) * 0.05
    grave += env * (np.sin(2 * np.pi * hz(raiz) * t) + 0.5 * np.sin(2 * np.pi * hz(raiz) * 2 * t) + 0.25 * np.sin(2 * np.pi * hz(raiz) * 3 * t)) * 0.12  # harmônicos: o grave aparece no celular

# filtro passa-baixa que respira devagar (abre e fecha a cada ~16 s), aplicado em blocos
corte = CORTE + 900 * (0.5 + 0.5 * np.sin(2 * np.pi * t / 16.0 - np.pi / 2))
bloco = SR // 10
pad_f = np.zeros(N)
zi = None
for i in range(0, N, bloco):
    sos = butter(2, corte[i] / (SR / 2), 'low', output='sos')
    if zi is None: zi = sosfilt_zi(sos) * 0
    y, zi = sosfilt(sos, pad[i:i + bloco], zi=zi)
    pad_f[i:i + bloco] = y

# sino: notas do acorde corrente, uma a cada ~2,7 s, oitava acima, com ataque curto e cauda longa
sino = np.zeros(N)
tk = 3.0
while tk < DUR - 3:
    k = int(tk // PASSO)
    notas, _ = ACORDES[k % len(ACORDES)]
    m = notas[rnd.integers(2, len(notas))] + 12
    i0 = int(tk * SR); L = int(4.0 * SR)
    tt = np.arange(min(L, N - i0)) / SR
    tom = np.sin(2 * np.pi * hz(m) * tt) + 0.35 * np.sin(2 * np.pi * hz(m) * 2.01 * tt) * np.exp(-tt * 3)
    sino[i0:i0 + len(tt)] += tom * np.exp(-tt * 1.4) * (1 - np.exp(-tt * 200)) * SINO
    tk += 2.4 + rnd.random() * 1.2

seco = pad_f + grave + sino
# reverb: resposta ao impulso sintética (ruído com decaimento exponencial de 4,5 s), estéreo
L = int(4.5 * SR); ti = np.arange(L) / SR
ir = [rnd.standard_normal(L) * np.exp(-ti * 1.5) for _ in range(2)]
ir = [sosfilt(butter(2, 6000 / (SR / 2), 'low', output='sos'), x) for x in ir]
wet = [fftconvolve(seco, x)[:N] for x in ir]
wet = [w / np.max(np.abs(w)) for w in wet]
esq = 0.55 * seco / np.max(np.abs(seco)) + 0.45 * wet[0]
dir_ = 0.55 * seco / np.max(np.abs(seco)) + 0.45 * wet[1]
st = np.stack([esq, dir_], 1)
# entra em 3 s, sai nos últimos 4 s
fade = np.clip(t / 3.0, 0, 1) * np.clip((DUR - t) / 4.0, 0, 1)
st *= fade[:, None]
st = 0.89 * st / np.max(np.abs(st))
sf.write(saida, st.astype(np.float32), SR, subtype='PCM_16')
print('ok', saida, round(DUR, 1), 's')
