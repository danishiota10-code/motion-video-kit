---
name: motion-video
description: >
  Processo para criar vídeos animados em código ("motion as code"): vídeos verticais pra
  WhatsApp/Reels com voz de IA, legenda, trilha e animação premium, feitos como páginas web
  (React + Motion) gravadas quadro a quadro. Use sempre que o usuário pedir um "motion",
  vídeo animado, vídeo de venda, explainer, vídeo pra Reels/WhatsApp com narração, ou quiser
  refazer ou ajustar um vídeo desse tipo.
---

# Motion video: o passo a passo

A base técnica fica em `~/Developer/motion-template/` (leia o `README.md` de lá antes de começar).
Se a pasta não existir, ou se `~/Developer/motion-template/.venv` não existir, pare e peça pro usuário
instalar o kit (o README do repositório `motion-video-kit` explica) ou rodar `bash ~/Developer/motion-template/instalar.sh`.

## Regra de ouro: conversar antes de gerar

O vídeo fica bom quando é refinado **etapa por etapa**, com o usuário decidindo. Em cada etapa:
1. Apresente opções, no máximo 3 a 5.
2. Dê uma recomendação com o porquê.
3. Mostre lado a lado em **imagem parada**, porque gerar foto é barato e render é caro.
4. Só avance com o "ok" dele.

Nunca renderize o vídeo inteiro sem passar pelas etapas. Registre cada decisão num `storyboard.md` na
pasta do projeto (ou na pasta do projeto no vault, se ele tiver um segundo cérebro), pra retomar depois.

## As etapas

0. **Briefing.**
   - Para quem é o vídeo, onde vai rodar (WhatsApp? Reels? horizontal pro YouTube?) e qual a ação esperada no fim.
   - Quem apresenta: uma voz de IA, a voz do próprio usuário, um avatar (imagem em `web/public/avatar.png`) ou ninguém.
   - Se houver um vault com `02 Context/`, leia `me.md` e, se existir, `marca.md`/`brand.md`: tom de voz e identidade visual vêm de lá.
1. **Roteiro e storyboard.**
   - Tabela cena a cena com o que é falado e o que aparece na tela. Procure um **fio condutor visual**: um elemento que nasce numa cena e volta nas outras.
   - Primeira frase: uma pergunta concreta que a pessoa responde na hora. Nada abstrato.
2. **Revisão das falas.** Antes de qualquer animação, porque as animações se prendem às palavras.
   - CTA de conversa, não "compre já", a menos que o usuário peça outro tom.
   - Nada de escassez inventada nem número que não seja verdade. Se ele quiser um exagero, avise uma vez e respeite a decisão.
3. **Tipografia.** Se o usuário já tem marca, use a dele. Senão, **sugira três combinações a partir do briefing** e mostre
   no mesmo quadro. Toda fonte do vídeo vive em `web/src/fontes.ts`: troque as três `OPCOES` pelas suas sugestões
   (qualquer família do Google Fonts), tire a foto
   (`bun scripts/foto.ts "pagina=tipo&op=A|pagina=tipo&op=B|pagina=tipo&op=C" ../out/tipo.png`) e, com o "ok", mude `ESCOLHIDA`.
   **Diga ao usuário, com todas as letras, que as três são só sugestões:** ele pode pedir qualquer fonte do Google Fonts pelo nome,
   mandar o arquivo da fonte da marca dele, ou pedir outra rodada de opções, quantas vezes quiser.
   - Fonte da marca (arquivo .woff2/.ttf/.otf): copie pra `web/public/fontes/`, registre em `LOCAIS` no `fontes.ts` (um item por peso)
     e use o nome registrado nas `OPCOES`. Tire a foto pra conferir que carregou: se a fonte cair na padrão do navegador, o arquivo ou o nome está errado.
   - Pergunte se ele tem licença pra usar a fonte comprada em vídeo; as do Google Fonts são livres.

   Ponto de partida por tom (só pra inspirar, misture à vontade):

   | Tom do vídeo | Títulos | Texto e legenda |
   |---|---|---|
   | Tecnologia, moderno, limpo | Geist, Inter Tight, Manrope | Geist, Inter |
   | Premium, editorial, elegante | Fraunces, Playfair Display, DM Serif Display | Inter, Source Sans 3 |
   | Impacto, esporte, chamada forte | Anton, Bebas Neue, Archivo Black | Inter, Archivo |
   | Amigável, educativo, leve | Nunito, Poppins, Baloo 2 | Nunito, Poppins |
   | Startup, produto, ousado | Space Grotesk, Sora, Syne | Space Grotesk, DM Sans |

   - Legenda sempre numa família sem serifa e em negrito: é ela que se lê no celular.
   - Fonte com itálico bonito (Fraunces, Playfair) pode marcar o destaque em itálico (`italico: true`); as outras destacam só pela cor.
   - Famílias largas (Anton, Archivo Black) pedem `escala` menor; confira se nenhum título passa de três linhas.
4. **Cores.** Mesma lógica: se o usuário tem marca, parta das cores dela. Senão, **sugira três paletas a partir do briefing**
   (nicho, público, emoção que o vídeo quer passar). Toda cor do vídeo vive em `web/src/cores.ts`: troque as três `OPCOES`,
   tire a foto (`bun scripts/foto.ts "pagina=tipo&pal=A|pagina=tipo&pal=B|pagina=tipo&pal=C" ../out/cores.png`) e,
   com o "ok", mude `ESCOLHIDA`. As três que vêm no template (grafite e coral, petróleo e lima, vinho e creme) são só exemplo.
   **Diga ao usuário que ele pode usar qualquer cor:** as hex da marca dele, uma imagem de referência (extraia as cores dela),
   ou só a descrição ("verde-escuro e dourado"). E que pode pedir outra rodada, ou trocar depois, quantas vezes quiser.
   - Fundo escuro com **uma** cor de destaque forte é o que lê melhor no celular; a cor de apoio só diferencia categorias.
   - O destaque precisa contrastar com o fundo e com o branco da legenda: confira a palavra acesa na legenda da foto.
   - `luz` é a cor do brilho que respira atrás das cenas; em geral, a mesma do destaque.
5. **Elementos: buscar referência antes de desenhar.** Não invente componente do zero. Pra cada cena do storyboard:
   1. **Procure nas duas vitrines** o tipo de peça que a cena pede (lista que se monta, números subindo, conexões entre ícones, cartões, terminal, gráfico):
      - **Magic UI** (https://magicui.design/docs/components): cada página tem demo e código aberto. As que mais servem em vídeo: Animated Beam, Orbiting Circles, Number Ticker, Animated List, Border Beam, Blur Fade, Word Rotate, Bento Grid, Particles, Terminal.
      - **21st.dev** (https://21st.dev/community/components): vitrine maior, feita pela comunidade; busque pelo nome da peça ("animated list", "testimonial", "pricing", "timeline").
   2. **Mostre 2 ou 3 referências** por cena pro usuário: o link da página e, se puder, uma captura da demo. Ele escolhe ou pede outras.
   3. **Adapte o código escolhido ao template**, sem copiar no escuro: o movimento passa a depender do tempo `t` da cena e das âncoras (`L`, `W`), com `mola`/`entra`/`suave` do `base.tsx`, porque animação com tempo próprio (CSS, `animate`, `setInterval`) não fica presa à fala. Troque as cores e as fontes pelas de `cores.ts` e `fontes.ts`.
   4. **Foto parada** da cena com a peça (`--so-stills`) antes de seguir.
   - Ícones das marcas **na cor do app** (`IconeApp`); ícones de linha do Lucide (`Lucide`).
   - Celular = **iPhone realista** (`Iphone`), a menos que ele prefira o minimalista (`pagina=celular&op=minimal`).
   - Legenda **sempre** na tela. Muita gente assiste sem som.
6. **Movimento.** Antes de animar, **leia a skill `motion-design`** (da LottieFiles, instalada junto com o kit em `~/.claude/skills/motion-design/`): ela traz os arquétipos de movimento, as curvas, as durações e o stagger. Proponha o arquétipo que combina com o briefing (o template nasceu no "Premium") e confirme com o usuário. Se a skill não estiver instalada, rode `bunx --bun skills add lottiefiles/motion-design-skill -g -a claude-code -y --copy`.
   Pra dúvida de API do Motion (molas, `useAnimationFrame`, `spring()`), a documentação é https://motion.dev/docs.
   Clipes curtos de ~8 s pra ele sentir (`render.ts --ini <s> --dur <fim>`). Padrão que funciona:
   - **câmera contínua**: cenas como janelas que a câmera atravessa (`Camada`), sem corte seco nem tremor;
   - molas calmas (`mola`, `CALMA`);
   - ritmo com respiro;
   - nenhuma tela vazia entre as cenas.
7. **Voz, trilha e efeitos.**
   - Voz: Google Chirp 3 HD, dentro da cota grátis. Gere a primeira frase do roteiro em 3 ou 4 vozes pra ele ouvir (`$P -I scripts/gerar_google.py --amostra "frase" Charon Fenrir Kore Aoede` → `audio/amostras/`). Não existe voz padrão: se ele não gostar, gere outras da lista do Google (cerca de 30 em pt-BR) até ele escolher, e registre a escolhida no storyboard. Ou a voz dele (ver "Narração com a própria voz").
   - Se não houver chave, guie o usuário pela seção "Chave da voz (de graça)" do `README.md` do template, um passo de cada vez, esperando ele confirmar cada um.
   - Trilha: composta em código, a **−11 dB**. A −20 dB some no alto-falante do celular.
   - Efeitos: poucos e discretos.
   - Amostras curtas em áudio pra ele ouvir. Pergunte se vai ouvir no celular.
8. **Folha de quadros.** Um quadro por cena (`--so-stills`) antes do render.
9. **Render final**, depois a **capa** e a entrega:
   - **Capa:** no WhatsApp a capa é o primeiro quadro, então o vídeo abre já com o gancho escrito na tela.
   - **Entrega:** pergunte onde salvar (ex.: `~/Desktop/<nome>.mp4`). Ofereça uma versão 1,25x (`setpts=PTS/1.25`, `atempo=1.25`) e, pro WhatsApp, uma leve em 720p.

## Pipeline técnico

Rode dentro da pasta do projeto (`~/Developer/motion-<nome>/`, copiada do template como no README).

```bash
P=~/Developer/motion-template/.venv/bin/python   # venv com whisper, torch, scipy
export ROTEIRO=scripts/roteiro.json        # [{tela, falado, pausa}]: tela = legenda, falado = o que a voz lê
$P -I scripts/gerar_google.py audio/takes audio/vo.wav <Voz>         # a voz escolhida (chave: ~/.config/motion-video/google-tts.env; --uso mostra a cota do mês)
bash scripts/tratar_voz.sh audio/vo.wav audio/vo                      # gera vo-limpa.wav
$P -I scripts/sincronia.py audio/vo.takes.json audio/takes audio/vo-limpa.wav web/src/sync.json audio/voz-final.wav
D=$(python3 -c "import json;print(json.load(open('web/src/sync.json'))['duration'])")
$P -I scripts/trilha.py audio/trilha.wav $D
$P -I scripts/sfx.py audio/sfx
$P -I scripts/mixar.py web/src/sync.json audio/voz-final.wav audio/trilha.wav audio/sfx audio/mix.wav
ffmpeg -i audio/mix.wav -af loudnorm=I=-14:TP=-1.0:LRA=9 -ar 48000 audio/mix-norm.wav
cd web && bun scripts/render.ts --dur $D --fps 30 --query "pagina=video" --so-stills --stills 3.1,6.7 --frames ../out/folha --out /tmp/x.mp4
bun scripts/render.ts --dur $D --fps 30 --query "pagina=video" --audio ../audio/mix-norm.wav --out ../out/video.mp4
```

- **Âncoras:** nas cenas, prenda tudo em `L(i).start` (começo da frase i) e `W(i, 'palavra')` (quando a palavra é dita). Os efeitos no `mixar.py` usam as mesmas âncoras: ao reescrever as cenas, reescreva o bloco "efeitos do vídeo" de lá.
- **Desempenho:** de ~10 a ~115 ms por quadro conforme o peso das cenas; 90 s de vídeo levam até ~5 min. Rode render longo em background com `caffeinate -i` pro Mac não dormir no meio.
- **Não edite `web/src` com um render rodando:** o Vite pode recarregar a página no meio. Prepare as correções antes, ou pare e recomece.
- **Narração com a própria voz** (não TTS): grave a narração inteira em `audio/voz-completa.wav` e use `$P -I scripts/sincronia_real.py audio/voz-completa.wav web/src/sync.json` no lugar de `gerar_google.py` + `sincronia.py`. Ponha os nomes próprios do vídeo em `scripts/nomes.txt` e as correções do Whisper, conferidas no take, em `scripts/correcoes.json`. Confira a legenda inteira antes de animar.
- **Vídeo horizontal (16:9):** o template nasceu vertical. Mude 1080×1920 → 1920×1080 em `web/index.html` (viewport), `web/src/index.css` (`#root`), `web/scripts/foto.ts` e `web/scripts/render.ts`, e reposicione legenda e títulos.

## Armadilhas já vividas

- **Cota da voz:** o `gerar_google.py` para sozinho em 900 mil caracteres no mês (a cota grátis é 1 milhão). Se parar, não contorne o limite: avise o usuário e espere o mês virar.
- **Rodar a voz de novo muda todas as frases.** Pra corrigir uma frase, troque só o take dela (`audio/takes/NN_0.wav`) e remonte a concatenação.
- **Pronúncias do Chirp:**
  - "IA" no meio da frase sai "eá", e "I.A.", "í-á" ou "i, á" também saem errados. Escreva **"inteligência artificial"** por extenso (o `gerar_google.py` já troca);
  - nome próprio seguido de vírgula às vezes sai com sílaba a mais: troque a vírgula por ponto no `falado`;
  - "Ah!" no começo da frase alonga demais: gere o "Ah!" sozinho, corte pra ~0,28 s, +3,5 dB e emende.
- **Nomes reais** de família, cliente ou empresa não entram nos exemplos da tela sem o usuário pedir. Use nomes genéricos (Carla Mendes, Proposta Q4).
- **Erro numa cena congela o resto do vídeo sem falhar o render.** Antes do render longo, rode `--so-stills` com um quadro a cada 10 s do vídeo inteiro e procure erro na página (`undefined is not iterable` etc.) e quadro preto ou repetido. Calcule índices e posições só dentro do `if` que decide se o elemento aparece.
- **Nada fica parado.** Um objeto que espera a próxima fala precisa de movimento sutil (girar devagar, respirar, pulsos correndo). Bolinhas paradas por 15 s incomodam.
- **Medir o tempo parado antes de entregar:** extraia 4 quadros/s sem a faixa da legenda e calcule a diferença média entre quadros. Liste os trechos de 2 s ou mais com fala e pouca diferença, e anime esses trechos.
- **Pessoa, ano ou lugar citado na fala aparece na tela:** retrato que se desenha, folhinha que corre até o ano citado, mapa com a cidade piscando. Imagens só de domínio público ou CC0 (Wikimedia Commons, conferindo a licença). Uma recusa ou um "não" na fala pede um X na tela; uma escolha pede estrela ou check no escolhido.
- **Rotação acumulada:** rotação proporcional ao `t` absoluto acumula. Use velocidade baixa (0,4°/s) ou o tempo local da cena.
- **Partes de uma cena se atravessando:** quando uma parte entra antes da anterior sair, dois títulos ficam juntos na tela e parece corrido. Sobreposição de no máximo 0,1 s.
- **Troca alternada (ícone A ↔ B):** a menos de ~0,9 s por troca, e sem transição, vira pisca-pisca.
- **Muito tempo sem voz cansa:** cartões lidos um a um por 13 s ficam longos. Mostre juntos, só com a frase de destaque.
- **Formas acidentais:** cabeça redonda com uma cruz embaixo vira o símbolo ♀ (pra pessoa, use cabeça e ombros); puxador em arco embaixo de uma etiqueta parece carinha sorrindo (use barra reta).
- **Depoimento com estrelas:** só com nota real dada pela pessoa. Pergunte antes de colocar.
- **zsh:** `set -- $v` não divide string em palavras. Use `if`/`case` ou bash.
- **WhatsApp:** o reloginho no envio significa "ainda subindo". Ative o "HD" ao mandar.

## Sites e ferramentas

| O quê | Link | Pra que serve |
|---|---|---|
| Motion | https://motion.dev/docs | Animação do React: molas, `useAnimationFrame`, `spring()`. `npx motion-ai` instala a skill e o MCP com a documentação |
| 21st.dev | https://21st.dev | Vitrine de componentes React/Tailwind; referência de estética |
| Magic UI | https://magicui.design | Componentes animados de referência: Animated Beam, Orbiting Circles, Number Ticker, Border Beam, Animated List, Blur Fade |
| Skill motion-design (LottieFiles) | https://github.com/lottiefiles/motion-design-skill | Princípios de motion: arquétipos (o template usa "Premium"), curvas, durações, stagger |
| Simple Icons | https://simpleicons.org | Ícones das marcas (CC0), com a cor oficial |
| Lucide | https://lucide.dev | Ícones de linha (ISC) |
| Google Fonts | https://fonts.google.com | Todas as fontes do vídeo; o `fontes.ts` carrega qualquer família pelo nome |
| Google Cloud Text-to-Speech | https://cloud.google.com/text-to-speech/docs/chirp3-hd | Voz Chirp 3 HD pt-BR |
| Whisper | https://github.com/openai/whisper | Tempo de cada palavra, pra sincronizar animação e legenda |
| Playwright | https://playwright.dev | Chrome sem tela + relógio falso pra gravar quadro a quadro |

Pra baixar um ícone novo: `curl -o web/public/icons/<marca>.svg https://cdn.simpleicons.org/<marca>` (e acrescente a cor em `MARCAS`, no `base.tsx`), ou `curl -o web/public/icons/l-<nome>.svg https://unpkg.com/lucide-static@latest/icons/<nome>.svg`.

**Testado e descartado:** vozes abertas grátis (Chatterbox, Kokoro) com qualidade insuficiente em pt-BR; ElevenLabs grátis não permite uso comercial; corte seco e tremor pareceram erro, a câmera contínua venceu.
