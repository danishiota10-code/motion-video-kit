#!/bin/bash
# Gera duas versões do voiceover: limpa (só nivelada) e "assistente" (presença, brilho metálico leve, ressonância curta).
# Uso: tratar_voz.sh <entrada.wav> <prefixo_saida>
set -e
in="$1"; out="$2"
NIVEL="loudnorm=I=-16:TP=-1.5:LRA=7"
ffmpeg -y -loglevel error -i "$in" -af "highpass=f=70,acompressor=threshold=-20dB:ratio=2.5:attack=5:release=90,$NIVEL" -ar 48000 "${out}-limpa.wav"
ffmpeg -y -loglevel error -i "$in" -af "highpass=f=110,equalizer=f=220:t=q:w=1:g=-3,equalizer=f=3200:t=q:w=1.2:g=3,equalizer=f=9000:t=h:w=1:g=2,chorus=0.7:0.9:12|18:0.25|0.18:0.25|0.4:1.2|1.8,aecho=0.85:0.5:28|46:0.18|0.10,acompressor=threshold=-20dB:ratio=3:attack=4:release=80,$NIVEL" -ar 48000 "${out}-assistente.wav"
echo "ok ${out}-limpa.wav ${out}-assistente.wav"
