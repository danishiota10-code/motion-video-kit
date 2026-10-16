# Motion Video

Vídeos animados feitos em código, com a sua IA: vídeo vertical pra WhatsApp e Reels, com voz, legenda, trilha e animação de nível de agência.

Cada cena é uma página web (React + Motion), gravada quadro a quadro. Isso dá duas coisas que editor de vídeo não dá: a IA escreve e ajusta cada cena por você, e cada animação se prende na palavra exata que a voz está dizendo.

Com o kit instalado, você ganha:

- **A skill `motion-video`**: peça *"quero fazer um motion"* e a IA conduz o processo etapa por etapa (briefing, roteiro, falas, tipografia, cores, elementos, movimento, som), mostrando opções em imagem parada antes de gastar tempo com render.
- **O template** em `~/Developer/motion-template/`: câmera contínua, legenda sincronizada, iPhone realista, ícones das marcas, trilha e efeitos compostos em código, e um vídeo de exemplo de 21 s pra ver tudo funcionando.
- **Voz de IA de graça**: o passo a passo pra usar a voz do Google (Chirp 3 HD) dentro da cota grátis de 1 milhão de caracteres por mês, com um contador que para sozinho antes do limite.

## O visual é seu

O kit vem com fontes e cores **só de exemplo**. Em todo vídeo, a IA sugere três combinações de fonte e três paletas pensadas pro seu briefing e mostra lado a lado pra você escolher. Mas a palavra final é sua:

- **Qualquer fonte do [Google Fonts](https://fonts.google.com)**: é só dizer o nome ("quero a Montserrat nos títulos").
- **A fonte da sua marca**, mesmo que não seja do Google: mande o arquivo (.woff2, .ttf ou .otf) e a IA instala no vídeo.
- **Qualquer cor**: as da sua marca em código (#FF7A59), uma foto ou print de referência, ou só a ideia ("verde-escuro e dourado, clima de natureza").
- **Quantas rodadas quiser**: não gostou das três sugestões, peça outras. Mudou de ideia no meio do vídeo, dá pra trocar depois.

Funciona no Mac. Precisa do [Homebrew](https://brew.sh), do Google Chrome e do Claude Code.

---

## Instalar

Abra o Claude Code em qualquer pasta e cole:

```
Instalar o Motion Video: https://github.com/danishiota10-code/motion-video-kit

Clona numa pasta temporária, lê o README.md e segue o bloco de instruções dele.
```

> [!IMPORTANT]
> **Instruções para a IA que vai instalar.** Faça tudo você mesmo, nesta ordem:
>
> 1. **Clone numa pasta temporária.** `git clone https://github.com/danishiota10-code/motion-video-kit.git "$TMPDIR/motion-video-kit"`. Se o clone pedir login, o repositório é privado: peça pro usuário rodar `gh auth login` (ou aceitar o convite de colaborador no GitHub) e tente de novo. Se o `git` não existir, instale antes (`xcode-select --install`).
> 2. **Instale a skill no nível do usuário**, pra ela funcionar em qualquer pasta: copie `skill/motion-video/` pra `~/.claude/skills/motion-video/`. Se já existir, substitua: é atualização.
> 3. **Instale o template.** Se `~/Developer/motion-template/` não existir, copie a pasta `template/` pra lá (`mkdir -p ~/Developer && cp -R "$TMPDIR/motion-video-kit/template" ~/Developer/motion-template`). Se já existir, é atualização: copie por cima **sem apagar** `.venv/`, `node_modules/`, `audio/` e `out/` (ex.: `rsync -a --exclude .venv --exclude node_modules --exclude audio --exclude out "$TMPDIR/motion-video-kit/template/" ~/Developer/motion-template/`). Nunca mexa nas pastas `~/Developer/motion-<nome>/` dos vídeos que o usuário já fez.
> 4. **Prepare a máquina:** `bash ~/Developer/motion-template/instalar.sh`. Demora alguns minutos (o Whisper tem ~1 GB). Se faltar o Homebrew ou o Chrome, o script avisa: explique pro usuário como instalar e rode de novo.
> 5. **Chave da voz.** Se o script disser que falta a chave do Google TTS, guie o usuário pela seção "Chave da voz (de graça)" de `~/Developer/motion-template/README.md`, passo a passo. A chave vai em `~/.config/motion-video/google-tts.env`, nunca numa pasta que vá pro GitHub. Se ele preferir deixar pra depois, siga: a chave só é necessária na etapa de voz.
> 6. **Teste.** Rode `cd ~/Developer/motion-template/web && bun scripts/render.ts --dur 21.16 --fps 30 --query "pagina=video" --so-stills --stills 1,5,9,13,17 --frames ../out/teste --out /tmp/x.mp4` e confira se saíram 5 imagens em `~/Developer/motion-template/out/teste/` sem "ERROS NA PÁGINA" (um 404 de favicon pode aparecer e não importa). Mostre uma das imagens pro usuário.
> 7. **Apague a pasta temporária** (`rm -rf "$TMPDIR/motion-video-kit"`).
> 8. **Confirme pro usuário** o que foi instalado e onde, e diga pra **fechar e abrir o Claude Code** pra skill aparecer. Pra começar, é só pedir: *"quero fazer um motion"*.

---

## Atualizar

Cole a mesma frase de instalação. A skill e o template são atualizados; o ambiente Python, a chave e os seus vídeos ficam intactos.

## Licenças

Ícones: [Simple Icons](https://simpleicons.org) (CC0) e [Lucide](https://lucide.dev) (ISC). Fontes do Google Fonts (OFL). A trilha e os efeitos são gerados pelos scripts, sem material de terceiros.
