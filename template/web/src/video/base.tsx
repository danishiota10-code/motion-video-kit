// Peças comuns do vídeo: paleta, fontes, tempo, sincronia com a voz, legenda, câmera e o iPhone.
import { useAnimationFrame } from 'motion/react';
import { spring } from 'motion';
import { createContext, useContext, useState, type ReactNode } from 'react';
import sync from '../sync.json';

import { PALETA } from '../cores';
// cores: troque em src/cores.ts
export const P = { ...PALETA, brilho: `rgba(${PALETA.luz},0.11)`, erro: '#FF6B6B', verde: '#25D366' };
import { FONTE, q } from '../fontes';
// fontes: troque em src/fontes.ts
export const TITULO = q(FONTE.titulo), SANS = q(FONTE.texto), MONO = q(FONTE.mono);
export const CALMA = { type: 'spring', stiffness: 90, damping: 20, mass: 1 } as const;
export const ENTRA = [0.05, 0.7, 0.1, 1] as const;

// a mola calma do Motion, tabelada (posição de 0 a 1 em função do tempo desde o início, em s)
const MOLA_TAB = (() => { const g = spring({ keyframes: [0, 1], stiffness: 90, damping: 20, mass: 1 }); return Array.from({ length: 301 }, (_, i) => g.next(i * 10).value as number); })();
export const mola = (s: number) => (s <= 0 ? 0 : s >= 3 ? 1 : MOLA_TAB[Math.round(s * 100)]!);
export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const suave = (x: number) => { x = clamp(x); return x * x * (3 - 2 * x); };
export const entra = (x: number) => { x = clamp(x); return 1 - Math.pow(1 - x, 3); };

// ---- sincronia ----
type Palavra = { w: string; start: number; end: number };
type Linha = { text: string; start: number; end: number; words: Palavra[] };
export const LINHAS: Linha[] = (sync as any).lines;
export const DURACAO: number = (sync as any).duration;
/** linha pelo índice do roteiro (0 = primeira frase) */
export const L = (i: number) => LINHAS[i]!;
/** início da palavra (primeira ocorrência que começa com `w`, sem pontuação) dentro da linha i */
export function W(i: number, w: string) {
  const limpa = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}-]/gu, '');
  const x = L(i).words.find((p) => limpa(p.w).startsWith(limpa(w)));
  if (!x) throw new Error(`palavra "${w}" não está na linha ${i}: ${L(i).text}`);
  return x.start;
}

// ---- tempo ----
const Tempo = createContext(0);
export function RelogioProvider({ children }: { children: ReactNode }) {
  const [t, setT] = useState(0);
  useAnimationFrame((ms) => setT(ms / 1000));
  return <Tempo.Provider value={t}>{children}</Tempo.Provider>;
}
export const useT = () => useContext(Tempo);

// ---- câmera: uma janela no caminho, chega do fundo e passa por nós ----
export function Camada({ ini, fim, children, entrada = 0.45, saida = 0.5 }: { ini: number; fim: number; children: (t: number) => ReactNode; entrada?: number; saida?: number }) {
  const t = useT();
  if (t < ini - entrada || t > fim + saida) return null;
  const chega = suave((t - (ini - entrada)) / entrada), passa = suave((t - fim) / saida);
  const esc = (0.82 + 0.18 * chega) * (1 + 0.9 * passa) * (1 + 0.03 * clamp((t - ini) / Math.max(0.1, fim - ini)));
  return (
    <div className="absolute inset-0" style={{ transform: `scale(${esc})`, opacity: chega * (1 - passa), filter: chega < 1 || passa > 0 ? `blur(${(1 - chega) * 14 + passa * 18}px)` : undefined }}>
      {children(t)}
    </div>
  );
}

// ---- legenda: sempre na tela, em blocos curtos; a palavra dita acende em dourado ----
const BLOCOS = LINHAS.flatMap((l) => {
  const out: Palavra[][] = []; let cur: Palavra[] = [];
  l.words.forEach((p, i) => {
    cur.push(p);
    const fimFrase = /[.!?:]$/.test(p.w), virgula = /,$/.test(p.w);
    if (fimFrase || (virgula && cur.length >= 4) || cur.length >= 8 || i === l.words.length - 1) { out.push(cur); cur = []; }
  });
  return out.map((b, k) => ({ palavras: b, ini: b[0]!.start - 0.12, fim: k < out.length - 1 ? out[k + 1]![0]!.start - 0.12 : l.end + 0.5 }));
});
export function Legenda() {
  const t = useT();
  const b = BLOCOS.find((x) => t >= x.ini && t < x.fim);
  if (!b) return null;
  return (
    <div className="absolute left-[60px] right-[60px] top-[1690px] text-center" style={{ fontFamily: SANS, fontWeight: 700, fontSize: 50, letterSpacing: '-0.015em', lineHeight: 1.22, textShadow: '0 2px 24px rgba(0,0,0,0.7)' }}>
      {b.palavras.map((p, i) => {
        const dita = t >= p.start - 0.05, agora = dita && t < p.end + 0.05;
        return <span key={i} style={{ color: agora ? P.destaque : P.osso, opacity: dita ? 1 : 0.35 }}>{p.w} </span>;
      })}
    </div>
  );
}

// ---- ícones ----
export const MARCAS: Record<string, string> = {
  gmail: '#EA4335', googlecalendar: '#4285F4', googledrive: '#1FA463', googledocs: '#4285F4', googlesheets: '#34A853',
  googlemeet: '#00897B', linkedin: '#0A66C2', telegram: '#26A5E4', whatsapp: '#25D366', openai: '#000000', claude: '#D97757', notion: '#FFFFFF',
};
export function IconeApp({ marca, tam = 56, cinza = 0 }: { marca: string; tam?: number; cinza?: number }) {
  const cor = MARCAS[marca] ?? '#333';
  const glifo = marca === 'notion' ? '#000' : '#fff';
  return (
    <div style={{ width: tam, height: tam, borderRadius: tam * 0.24, background: cor, display: 'grid', placeItems: 'center', flexShrink: 0, boxShadow: '0 2px 10px rgba(0,0,0,0.35)', filter: cinza ? `grayscale(${cinza}) brightness(${1 - 0.55 * cinza})` : undefined }}>
      <div style={{ width: tam * 0.58, height: tam * 0.58, background: glifo, WebkitMask: `url(/icons/${marca}.svg) center/contain no-repeat`, mask: `url(/icons/${marca}.svg) center/contain no-repeat` }} />
    </div>
  );
}
export function Lucide({ nome, cor, tam }: { nome: string; cor: string; tam: number }) {
  return <div style={{ width: tam, height: tam, background: cor, flexShrink: 0, WebkitMask: `url(/icons/l-${nome}.svg) center/contain no-repeat`, mask: `url(/icons/l-${nome}.svg) center/contain no-repeat` }} />;
}
// quem apresenta o vídeo (opcional): coloque a imagem em web/public/avatar.png
export function Avatar({ tam, style }: { tam: number; style?: React.CSSProperties }) {
  return <img src="/avatar.png" className="rounded-full" style={{ width: tam, height: tam, objectFit: 'cover', ...style }} />;
}

// ---- títulos palavra a palavra; trechos entre *asteriscos* saem em dourado (e em itálico, se a fonte escolhida pedir) ----
export function Titulo({ txt, t0, top = 170, tam = 96, cor = P.osso }: { txt: string; t0: number; top?: number; tam?: number; cor?: string }) {
  const t = useT();
  const partes = txt.split(/(\*[^*]+\*)/).filter(Boolean).flatMap((s) => {
    const dest = s.startsWith('*');
    return s.replace(/\*/g, '').split(' ').filter(Boolean).map((w) => ({ w, dest }));
  });
  return (
    <h1 className="absolute left-[50px] right-[50px] text-center" style={{ top, fontFamily: TITULO, fontWeight: FONTE.tituloPeso, fontSize: tam * FONTE.escala, lineHeight: 1.04, letterSpacing: FONTE.track, color: cor }}>
      {partes.map((p, i) => {
        const a = entra((t - t0 - i * 0.07) / 0.55);
        return <span key={i} style={{ display: 'inline-block', marginRight: '0.22em', opacity: a, transform: `translateY(${(1 - a) * 26}px)`, filter: a < 1 ? `blur(${(1 - a) * 10}px)` : undefined, color: p.dest ? P.destaque : undefined, fontStyle: p.dest && FONTE.italico ? 'italic' : undefined }}>{p.w}</span>;
      })}
    </h1>
  );
}

// ---- iPhone realista (moldura de titânio, ilha dinâmica, botões) ----
export function Iphone({ top, esc = 1, children }: { top: number; esc?: number; children: ReactNode }) {
  const w = 760, h = 1560;
  return (
    <div className="absolute left-1/2" style={{ top, width: w, height: h, marginLeft: -w / 2, transform: `scale(${esc})`, transformOrigin: 'top center' }}>
      <div className="absolute" style={{ left: -6, top: 300, width: 6, height: 90, borderRadius: 3, background: '#5A5566' }} />
      <div className="absolute" style={{ left: -6, top: 420, width: 6, height: 150, borderRadius: 3, background: '#5A5566' }} />
      <div className="absolute" style={{ right: -6, top: 460, width: 6, height: 220, borderRadius: 3, background: '#5A5566' }} />
      <div className="absolute inset-0" style={{ borderRadius: 112, background: 'linear-gradient(145deg, #8B8696 0%, #3D3A47 30%, #6E6979 55%, #2E2B36 80%, #7C7787 100%)', boxShadow: `0 60px 120px rgba(0,0,0,0.6), 0 0 80px rgba(${P.luz},0.18)` }} />
      <div className="absolute" style={{ inset: 7, borderRadius: 106, background: '#000' }} />
      <div className="absolute overflow-hidden" style={{ inset: 20, borderRadius: 92 }}>
        {children}
        <div className="absolute left-0 right-0 top-[26px] flex items-center justify-between px-[60px]" style={{ fontFamily: SANS, fontWeight: 600, fontSize: 28, color: P.osso }}>
          <span>9:30</span>
          <span className="flex items-center gap-[10px]">
            <svg width="34" height="22" viewBox="0 0 34 22"><rect x="0" y="14" width="6" height="8" rx="1.5" fill={P.osso} /><rect x="9" y="10" width="6" height="12" rx="1.5" fill={P.osso} /><rect x="18" y="5" width="6" height="17" rx="1.5" fill={P.osso} /><rect x="27" y="0" width="6" height="22" rx="1.5" fill={P.osso} /></svg>
            <svg width="30" height="22" viewBox="0 0 30 22"><path d="M15 21l4-4.6a6 6 0 0 0-8 0zM6.5 12.2a12 12 0 0 1 17 0l-2.7 3a8 8 0 0 0-11.6 0zM2 7.6a18 18 0 0 1 26 0l-2.7 3a14 14 0 0 0-20.6 0z" fill={P.osso} /></svg>
            <svg width="48" height="22" viewBox="0 0 48 22"><rect x="1" y="1" width="40" height="20" rx="6" fill="none" stroke={P.osso} strokeOpacity="0.5" strokeWidth="2" /><rect x="4" y="4" width="30" height="14" rx="3.5" fill={P.osso} /><rect x="43" y="7" width="3" height="8" rx="1.5" fill={P.osso} fillOpacity="0.5" /></svg>
          </span>
        </div>
        <div className="absolute left-1/2 top-[22px] h-[64px] w-[220px] -translate-x-1/2 rounded-full bg-black" />
        <div className="absolute bottom-[20px] left-1/2 h-[8px] w-[240px] -translate-x-1/2 rounded-full" style={{ background: 'rgba(255,255,255,0.7)' }} />
      </div>
    </div>
  );
}

export function semente(s: number) { return () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; }; }
