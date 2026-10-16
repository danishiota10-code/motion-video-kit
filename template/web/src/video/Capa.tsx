// Opções de capa, pra comparar lado a lado (bun scripts/foto.ts "pagina=capa&op=A|pagina=capa&op=B" ../out/capa.png).
// No WhatsApp a pré-visualização do vídeo é o primeiro quadro, então a capa escolhida
// vira o quadro inicial do vídeo (e se desfaz na primeira cena).
import { P, MONO, Titulo } from './base';

function Fundo({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ color: P.osso, background: `linear-gradient(180deg, ${P.fundo} 0%, ${P.fundo2} 55%, ${P.fundo} 100%)` }}>
      <div className="absolute rounded-full" style={{ left: 40, top: 520, width: 1000, height: 1000, background: `radial-gradient(circle, rgba(${P.luz},0.14), transparent 65%)`, filter: 'blur(40px)' }} />
      {children}
    </div>
  );
}
const Selo = ({ top, txt }: { top: number; txt: string }) => (
  <div className="absolute left-0 right-0 text-center" style={{ top, fontFamily: MONO, fontSize: 28, letterSpacing: '0.3em', color: P.destaque }}>{txt}</div>
);

export default function Capa({ op }: { op: string }) {
  if (op === 'A') return (
    <Fundo>
      <Titulo txt="Quanto tempo você levaria pra fazer *um vídeo assim?*" t0={-9} top={560} tam={124} />
      <Selo top={1260} txt="MOTION AS CODE" />
    </Fundo>
  );
  return (
    <Fundo>
      <Selo top={600} txt="VÍDEO FEITO EM CÓDIGO" />
      <Titulo txt="Cada cena é uma *página web.*" t0={-9} top={700} tam={140} />
    </Fundo>
  );
}
