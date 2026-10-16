#!/bin/bash
# Prepara a máquina pra fazer vídeos com este template (macOS). Pode rodar de novo: só instala o que falta.
#   bash instalar.sh
set -e
AQUI="$(cd "$(dirname "$0")" && pwd)"
ok() { printf '  ok  %s\n' "$1"; }
falta() { printf '  --  %s\n' "$1"; }

echo "1/5 Homebrew"
if ! command -v brew >/dev/null; then
  falta "Homebrew não encontrado. Instale com o comando de https://brew.sh e rode este script de novo."; exit 1
fi
ok brew

echo "2/5 ffmpeg (corta, mixa e grava o mp4)"
command -v ffmpeg >/dev/null || brew install ffmpeg
ok ffmpeg

echo "3/5 Bun (roda a página web e o gravador)"
if ! command -v bun >/dev/null; then
  curl -fsSL https://bun.sh/install | bash
  export PATH="$HOME/.bun/bin:$PATH"
fi
ok "bun $(bun --version)"
(cd "$AQUI/web" && bun install)
ok "dependências da página web"
# princípios de movimento (arquétipos, curvas, durações) que a skill motion-video consulta na etapa de movimento
if [ ! -f "$HOME/.claude/skills/motion-design/SKILL.md" ]; then
  (cd "$HOME" && bunx --bun skills add lottiefiles/motion-design-skill -g -a claude-code -y --copy >/dev/null)
fi
ok "skill motion-design (LottieFiles)"

echo "4/5 Google Chrome (o gravador usa o Chrome sem tela)"
if [ -d "/Applications/Google Chrome.app" ]; then ok chrome; else falta "Instale o Google Chrome: https://www.google.com/chrome"; fi

echo "5/5 Python 3.11 + Whisper (~1 GB, demora alguns minutos)"
if ! command -v uv >/dev/null; then
  curl -LsSf https://astral.sh/uv/install.sh | sh
  export PATH="$HOME/.local/bin:$PATH"
fi
[ -d "$AQUI/.venv" ] || uv venv --python 3.11 "$AQUI/.venv"
uv pip install --python "$AQUI/.venv/bin/python" -r "$AQUI/requirements.txt"
ok "ambiente Python em $AQUI/.venv"

echo
if [ -n "$GOOGLE_TTS_API_KEY" ] || [ -f "$HOME/.config/motion-video/google-tts.env" ]; then
  ok "chave do Google TTS encontrada"
else
  falta "Falta a chave da voz (Google Cloud Text-to-Speech). Veja \"Chave da voz\" no README.md."
fi
echo "Pronto."
