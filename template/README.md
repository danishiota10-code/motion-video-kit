# motion-template

Base para vídeos "motion as code": cada cena é uma página web (React + Motion), gravada quadro a quadro num Chrome sem tela, com voz de IA, legenda, trilha e efeitos feitos em código. Nasce vertical (1080×1920, pra WhatsApp e Reels).

O processo (as etapas de conversa antes de gerar e os comandos) está na skill `motion-video`, instalada em `~/.claude/skills/motion-video/SKILL.md`. Peça pra IA: *"quero fazer um motion"*.

## Preparar a máquina (uma vez)

```bash
bash ~/Developer/motion-template/instalar.sh
```

Instala o que faltar: ffmpeg, Bun, as dependências da página e o ambiente Python com Whisper (~1 GB, em `.venv/`). Precisa do Homebrew e do Google Chrome.

### Chave da voz (de graça)

A voz é o Google Cloud Text-to-Speech, modelo **Chirp 3 HD**: as vozes pt-BR mais naturais que existem hoje sem pagar. O Google dá **1 milhão de caracteres grátis por mês** nesse modelo ([tabela de preços](https://cloud.google.com/text-to-speech/pricing)). Um vídeo de 90 s tem uns 1.300 caracteres: dá pra gerar a voz centenas de vezes por mês sem pagar nada.

O Google pede um cartão pra liberar a API, mesmo dentro da cota grátis. Três travas garantem que você não paga:
- o `gerar_google.py` conta cada caractere e **para sozinho em 900 mil no mês** (`python scripts/gerar_google.py --uso` mostra quanto já foi);
- um alerta de orçamento de US$ 1 avisa por e-mail se aparecer qualquer custo;
- a chave só funciona pra voz, então mesmo vazada não serve pra outra coisa.

Passo a passo, com a sua conta Google (uns 10 minutos):

1. **Conta no Google Cloud.** Entre em https://console.cloud.google.com com o seu Gmail e aceite os termos. Se aparecer a oferta de **teste gratuito**, ative: o Google pede o cartão só pra confirmar que você é uma pessoa e não cobra sem você mudar pra conta paga.
2. **Projeto.** Em https://console.cloud.google.com/projectcreate crie um projeto chamado `motion-video`. Confira no topo da página que é ele que está selecionado.
3. **Ativar a voz.** Abra https://console.cloud.google.com/apis/library/texttospeech.googleapis.com e clique em **Ativar**. Se pedir uma conta de faturamento, escolha a do passo 1.
4. **Criar a chave.** Em https://console.cloud.google.com/apis/credentials: **Criar credenciais → Chave de API**. Na chave criada, **Editar chave → Restrições de API → Restringir chave** e marque só a **Cloud Text-to-Speech API**. Salve e copie a chave.
5. **Guardar a chave no Mac**, fora de qualquer pasta que vá pro GitHub (troque `cole-a-chave-aqui`):
   ```bash
   mkdir -p ~/.config/motion-video && echo "GOOGLE_TTS_API_KEY=cole-a-chave-aqui" > ~/.config/motion-video/google-tts.env
   ```
6. **Alerta de orçamento.** Em https://console.cloud.google.com/billing/budgets: **Criar orçamento**, valor **US$ 1**, alertas em 50%, 90% e 100%. O e-mail chega na sua caixa.
7. **Testar e escolher a voz.** Gere a mesma frase em quatro vozes e ouça:
   ```bash
   cd ~/Developer/motion-template && .venv/bin/python -I scripts/gerar_google.py --amostra "Quanto tempo você levaria pra fazer um vídeo assim?" Puck Charon Kore Aoede
   open audio/amostras
   ```
   Puck e Charon são masculinas; Kore e Aoede, femininas. A lista completa está em https://cloud.google.com/text-to-speech/docs/chirp3-hd.

Se aparecer "O Google recusou (403)", a API do passo 3 não foi ativada no projeto da chave, ou a restrição do passo 4 marcou outra API.

Prefere narrar com a própria voz? Grave a narração inteira e use `scripts/sincronia_real.py` no lugar da voz de IA (ver a skill).

## O que tem aqui

| Caminho | Para quê |
|---|---|
| `web/` | Vite + React + Motion + Tailwind. Cada cena é uma página web |
| `web/src/fontes.ts` | As fontes do vídeo e as três candidatas da comparação: o único lugar pra trocar fonte |
| `web/src/cores.ts` | As cores do vídeo e as três paletas candidatas: o único lugar pra trocar cor |
| `web/src/video/base.tsx` | Relógio, sincronia com a voz (`L`, `W`), legenda, `Camada` (câmera contínua), `Titulo`, `IconeApp`, `Lucide`, `Iphone`, `mola` |
| `web/src/video/cenas.tsx`, `Video.tsx` | O vídeo de **exemplo** (6 cenas, 21 s). Num vídeo novo, reescreva |
| `web/src/video/Capa.tsx` | Opções de capa (no WhatsApp a capa é o primeiro quadro) |
| `web/src/Tipografia.tsx`, `Celular.tsx` | Páginas de comparação lado a lado: as três fontes candidatas, as três paletas, dois celulares |
| `web/scripts/render.ts` | Grava quadro a quadro com relógio falso (`--so-stills` tira só as fotos de revisão) |
| `web/scripts/foto.ts` | Foto de uma ou várias páginas (`"pagina=tipo&op=A\|pagina=tipo&op=B"`) |
| `scripts/gerar_google.py` | Voz Google Chirp 3 HD, uma frase por take |
| `scripts/tratar_voz.sh` | Nivela a voz (`-limpa`) e gera uma versão "assistente", com brilho metálico |
| `scripts/sincronia.py` | Tempo de cada palavra (Whisper) → `web/src/sync.json` |
| `scripts/sincronia_real.py` | O mesmo, pra narração gravada com a sua voz |
| `scripts/trilha.py` | Trilha ambiente composta em código (sem direitos de terceiros) |
| `scripts/sfx.py` | Efeitos sintetizados: tic, whoosh, ding, nasce |
| `scripts/mixar.py` | Voz + trilha (−11 dB, abaixando sob a voz) + efeitos presos às mesmas âncoras das cenas |
| `web/public/icons/` | Simple Icons (marcas, CC0) e Lucide (`l-*`, ISC) |

## Trocar fontes e cores

As fontes e cores do template são só exemplo. Use as que quiser:

- **Fontes:** `web/src/fontes.ts`. Qualquer família do Google Fonts pelo nome; pra fonte própria, ponha o arquivo em `web/public/fontes/` e registre em `LOCAIS` (o próprio arquivo mostra como).
- **Cores:** `web/src/cores.ts`. Qualquer cor em hex.

Nos dois arquivos, `OPCOES` são as três candidatas que aparecem lado a lado e `ESCOLHIDA` é a que vai pro vídeo. Na prática, você só pede pra IA ("quero a fonte da minha marca", "usa essas cores") e ela edita.

## Ver o exemplo

```bash
cd ~/Developer/motion-template/web && bunx vite
```

Abra http://localhost:5173 no Chrome (a página é 1080×1920: diminua o zoom). `?pagina=tipo&op=B`, `?pagina=tipo&pal=C`, `?pagina=celular&op=real` e `?pagina=capa&op=B` mostram as páginas de comparação.

## Começar um vídeo novo

```bash
rsync -a --exclude .venv --exclude node_modules --exclude audio --exclude out ~/Developer/motion-template/ ~/Developer/motion-<nome>/
cd ~/Developer/motion-<nome>/web && bun install
```

O ambiente Python (1 GB) fica **só no template**: todo projeto chama `~/Developer/motion-template/.venv/bin/python`. Não apague essa pasta.
