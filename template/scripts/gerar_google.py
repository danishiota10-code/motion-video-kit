# Gera o voiceover pelo Google Cloud Text-to-Speech (Chirp 3 HD), uma frase por take:
# <pasta>/NN_0.wav + <saida>.takes.json + <saida>.wav (takes aparados + pausas do roteiro).
# Chave: variável GOOGLE_TTS_API_KEY ou o arquivo ~/.config/motion-video/google-tts.env (linha GOOGLE_TTS_API_KEY=...).
# Vozes pt-BR: https://cloud.google.com/text-to-speech/docs/chirp3-hd (padrão: Puck).
#
# Fica de graça: o Chirp 3 HD tem 1 milhão de caracteres grátis por mês, e um vídeo de 90 s tem ~1.300.
# Este script conta cada caractere enviado em ~/.config/motion-video/uso.json e se recusa a passar de
# 900 mil no mês (mude com MOTION_LIMITE_CARACTERES), pra nunca chegar perto da cobrança.
#
# Uso:
#   ROTEIRO=scripts/roteiro.json python gerar_google.py <pasta_takes> <saida.wav> [voz]
#   python gerar_google.py --amostra "Uma frase do roteiro." Puck Charon Kore Aoede   → audio/amostras/<voz>.wav
#   python gerar_google.py --uso                                                      → quanto já foi usado no mês
import sys, os, json, base64, urllib.request, urllib.error, datetime
from pathlib import Path

CONFIG = Path.home() / ".config/motion-video"
ARQ, USO = CONFIG / "google-tts.env", CONFIG / "uso.json"
LIMITE = int(os.environ.get("MOTION_LIMITE_CARACTERES", "900000"))
MES = datetime.date.today().strftime("%Y-%m")

def usado():
    return json.loads(USO.read_text()).get(MES, 0) if USO.exists() else 0

def somar(n):
    d = json.loads(USO.read_text()) if USO.exists() else {}
    d[MES] = d.get(MES, 0) + n
    CONFIG.mkdir(parents=True, exist_ok=True); USO.write_text(json.dumps(d, indent=1))

if sys.argv[1:2] == ["--uso"]:
    print(f"{MES}: {usado():,} de {LIMITE:,} caracteres (a cota grátis do Chirp 3 HD é 1.000.000 por mês)".replace(",", "."))
    sys.exit()

env = dict(l.split("=", 1) for l in ARQ.read_text().splitlines() if "=" in l and not l.startswith("#")) if ARQ.exists() else {}
CHAVE = (os.environ.get("GOOGLE_TTS_API_KEY") or env.get("GOOGLE_TTS_API_KEY", "")).strip()
if not CHAVE: sys.exit(f"Falta a chave do Google TTS: exporte GOOGLE_TTS_API_KEY ou crie {ARQ} (passo a passo no README.md)")

# Ajustes de pronúncia: o texto da tela fica como está, a voz recebe a versão ajustada.
# A sigla IA: "IA" sai "eá", e "I.A.", "í-á" ou "i, á" também saem errados. Vai por extenso.
# Acrescente aqui os nomes que o Chirp ler errado (às vezes basta trocar a vírgula depois do nome por ponto).
AJUSTES = {" I.A.": " inteligência artificial", " IA": " inteligência artificial"}

def falar(texto, voz):
    if usado() + len(texto) > LIMITE:
        sys.exit(f"Parei: este mês já foram {usado():,} caracteres e o limite de segurança é {LIMITE:,}. Espere o mês virar.".replace(",", "."))
    corpo = {"input": {"text": texto}, "voice": {"languageCode": "pt-BR", "name": f"pt-BR-Chirp3-HD-{voz}"},
             "audioConfig": {"audioEncoding": "LINEAR16", "sampleRateHertz": 24000}}
    req = urllib.request.Request("https://texttospeech.googleapis.com/v1/text:synthesize", json.dumps(corpo).encode(),
                                 {"Content-Type": "application/json", "X-Goog-Api-Key": CHAVE})
    try:
        audio = base64.b64decode(json.load(urllib.request.urlopen(req))["audioContent"])
    except urllib.error.HTTPError as e:
        sys.exit(f"O Google recusou ({e.code}): {e.read().decode()[:400]}\n"
                 "403 costuma ser a API não ativada no projeto ou a chave restrita a outra API; 400 com o nome da voz, voz errada.")
    somar(len(texto))
    return audio

import torch, torchaudio as ta

if sys.argv[1:2] == ["--amostra"]:
    frase, vozes = sys.argv[2], sys.argv[3:] or ["Puck", "Charon", "Kore", "Aoede"]
    pasta = Path("audio/amostras"); pasta.mkdir(parents=True, exist_ok=True)
    for v in vozes:
        (pasta / f"{v}.wav").write_bytes(falar(frase, v)); print("ok", pasta / f"{v}.wav")
    sys.exit()

pasta, saida = Path(sys.argv[1]), sys.argv[2]
voz = sys.argv[3] if len(sys.argv) > 3 else "Puck"
pasta.mkdir(parents=True, exist_ok=True)
roteiro = json.loads(Path(os.environ["ROTEIRO"]).read_text())

def aparar(w, sr):  # tira o silêncio das pontas do take, com uma folga curta
    x = w.abs().mean(0); win = int(0.02 * sr)
    e = torch.nn.functional.avg_pool1d(x[None, None], win, win)[0, 0]
    on = (e > e.max() * 0.04).nonzero()
    a = max(0, on[0].item() * win - int(0.06 * sr)); b = min(w.shape[1], (on[-1].item() + 1) * win + int(0.12 * sr))
    return w[:, a:b]

partes, relatorio, sr = [], [], 24000
for i, item in enumerate(roteiro):
    texto = item.get("falado") or item["tela"]
    for k, v in AJUSTES.items(): texto = texto.replace(k, v)
    nome = f"{i:02d}_0.wav"
    bruto = pasta / f"bruto_{nome}"
    bruto.write_bytes(falar(texto, voz))
    w, sr = ta.load(str(bruto)); bruto.unlink()
    w = aparar(w, sr)
    ta.save(str(pasta / nome), w, sr)
    partes += [w, torch.zeros(1, int(item["pausa"] * sr))]
    relatorio.append([i, 1.0, nome, texto])
    print(f"{i:02d} {w.shape[1] / sr:5.2f}s  {texto}")
final = torch.cat(partes, 1)
ta.save(saida, final, sr)
Path(saida).with_suffix(".takes.json").write_text(json.dumps(relatorio, ensure_ascii=False, indent=1))
print("salvo", saida, round(final.shape[1] / sr, 1), "s ·", f"{usado():,} caracteres usados em {MES}".replace(",", "."))
