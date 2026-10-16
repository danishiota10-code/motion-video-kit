// Tipografia do vídeo: o único lugar pra trocar fonte.
// OPCOES são as três candidatas que aparecem lado a lado na etapa de tipografia (?pagina=tipo&op=A|B|C).
// As três abaixo são só exemplo. Escolha a partir do briefing (tom do vídeo, público, marca): qualquer família do Google Fonts serve,
// ou a fonte própria registrada em LOCAIS (mais abaixo). Pra mais rodadas, acrescente D, E...
// O carregamento se ajusta sozinho aos nomes. Depois da escolha, mude ESCOLHIDA.
export type Fonte = {
  nome: string;        // rótulo na comparação
  titulo: string;      // família dos títulos
  tituloPeso: number;
  escala: number;      // tamanho relativo do título (famílias largas pedem menos de 1)
  track: string;       // espaçamento entre letras do título
  italico: boolean;    // o destaque (*entre asteriscos*) sai em itálico, além da cor
  texto: string;       // família da legenda e dos textos
  mono: string;        // família dos rótulos e do código
};

export const OPCOES: Record<string, Fonte> = {
  A: { nome: 'Geist', titulo: 'Geist', tituloPeso: 700, escala: 0.8, track: '-0.045em', italico: false, texto: 'Geist', mono: 'Geist Mono' },
  B: { nome: 'Fraunces + Inter', titulo: 'Fraunces', tituloPeso: 600, escala: 0.86, track: '-0.025em', italico: true, texto: 'Inter', mono: 'JetBrains Mono' },
  C: { nome: 'Space Grotesk', titulo: 'Space Grotesk', tituloPeso: 700, escala: 0.8, track: '-0.04em', italico: false, texto: 'Space Grotesk', mono: 'JetBrains Mono' },
};
export const ESCOLHIDA = 'A';
export const FONTE = OPCOES[ESCOLHIDA]!;
export const q = (familia: string) => `"${familia}"`;

// Fonte própria (a da marca, ou uma comprada): ponha os arquivos .woff2/.ttf/.otf em web/public/fontes/
// e registre cada um aqui com o nome que você vai usar nas OPCOES. Ex.:
//   'Minha Marca': [{ arquivo: 'MinhaMarca-Bold.woff2', peso: '700' }, { arquivo: 'MinhaMarca-Regular.woff2', peso: '400' }],
export const LOCAIS: Record<string, { arquivo: string; peso: string; italico?: boolean }[]> = {};

// Carrega todas as famílias das opções: as de LOCAIS pelos arquivos, as outras do Google Fonts (um <link> por família,
// pra uma que falhe não derrubar as outras), e espera cada peso usado, porque o primeiro quadro gravado já precisa da fonte certa.
export function carregarFontes() {
  const fams = new Map<string, boolean>(); // família → precisa de itálico
  for (const o of Object.values(OPCOES)) {
    fams.set(o.titulo, (fams.get(o.titulo) ?? false) || o.italico);
    for (const f of [o.texto, o.mono]) if (!fams.has(f)) fams.set(f, false);
  }
  const locais = Object.entries(LOCAIS).flatMap(([f, arqs]) => arqs.map((a) =>
    new FontFace(f, `url(/fontes/${a.arquivo})`, { weight: a.peso, style: a.italico ? 'italic' : 'normal' }).load()
      .then((ff) => { document.fonts.add(ff); }, () => console.error(`fonte não carregou: /fontes/${a.arquivo}`))));
  for (const f of Object.keys(LOCAIS)) fams.delete(f);
  const links = locais.concat([...fams].map(([f, ital]) => new Promise<void>((ok) => {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = `https://fonts.googleapis.com/css2?family=${f.replace(/ /g, '+')}:${ital ? 'ital,wght@0,400;0,500;0,600;0,700;1,400;1,600' : 'wght@400;500;600;700'}&display=block`;
    l.onload = l.onerror = () => ok();
    document.head.appendChild(l);
  })));
  return Promise.all(links).then(() => Promise.all([...fams].flatMap(([f, ital]) =>
    ['400', '600', '700'].map((w) => document.fonts.load(`${w} 30px ${q(f)}`)).concat(ital ? [document.fonts.load(`italic 600 30px ${q(f)}`)] : []))));
}
