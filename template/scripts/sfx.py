# Efeitos sonoros discretos, sintetizados (sem banco de terceiros):
#   tic     wikilink acendendo: clique de vidro curto e agudo
#   whoosh  câmera atravessando uma janela: ruído filtrado que sobe e desce
#   ding    notificação: dois parciais de sino, macio
#   nasce   algo nascendo da luz (uma revelação): brilho que cresce e abre num acorde
# Uso: python sfx.py <pasta>
import sys
from pathlib import Path
import numpy as np
from scipy.signal import butter, sosfilt
import soundfile as sf

SR = 48000
pasta = Path(sys.argv[1]); pasta.mkdir(parents=True, exist_ok=True)
rnd = np.random.default_rng(9)
hz = lambda m: 440 * 2 ** ((m - 69) / 12)
tt = lambda s: np.arange(int(s * SR)) / SR

def salvar(nome, x, ganho):
    x = x / np.max(np.abs(x)) * ganho
    sf.write(pasta / f"{nome}.wav", np.stack([x, x], 1).astype(np.float32), SR, subtype='PCM_16')

t = tt(0.35)
tic = (np.sin(2 * np.pi * 2637 * t) + 0.5 * np.sin(2 * np.pi * 3951 * t)) * np.exp(-t * 38) * (1 - np.exp(-t * 3000))
salvar('tic', tic, 0.5)

t = tt(0.9)
ruido = rnd.standard_normal(len(t))
env = np.sin(np.pi * np.clip(t / 0.9, 0, 1)) ** 2
y = np.zeros(len(t)); b = SR // 50
for i in range(0, len(t), b):  # passa-banda que varre de 300 Hz a 2,4 kHz e volta
    f = 300 + 2100 * np.sin(np.pi * i / len(t))
    y[i:i + b] = sosfilt(butter(2, [f * 0.6 / (SR / 2), f * 1.4 / (SR / 2)], 'band', output='sos'), ruido[i:i + b])
salvar('whoosh', y * env, 0.35)

t = tt(1.6)
ding = (np.sin(2 * np.pi * hz(88) * t) + 0.4 * np.sin(2 * np.pi * hz(95) * t) * np.exp(-t * 4)) * np.exp(-t * 3.2) * (1 - np.exp(-t * 600))
salvar('ding', ding, 0.4)

t = tt(2.6)
cresce = np.clip(t / 1.4, 0, 1) ** 2 * np.exp(-np.clip(t - 1.4, 0, None) * 2.2)
brilho = sum(np.sin(2 * np.pi * hz(m) * t + rnd.random() * 6) for m in (74, 78, 81, 85, 86)) / 5
ar = sosfilt(butter(2, [3000 / (SR / 2), 9000 / (SR / 2)], 'band', output='sos'), rnd.standard_normal(len(t))) * 0.25
salvar('nasce', (brilho + ar) * cresce, 0.45)
print('ok', sorted(p.name for p in pasta.glob('*.wav')))
