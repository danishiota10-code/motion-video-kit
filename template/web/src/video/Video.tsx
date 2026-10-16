// O vídeo inteiro: um plano contínuo. Cada cena é uma janela que a câmera atravessa, com início e fim presos às falas.
import { P, L, DURACAO, Camada, Legenda, RelogioProvider, useT, clamp, suave } from './base';
import { Pergunta, Pagina, Voz, Palavras, Quadros, Final } from './cenas';

const GRAO = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='300' height='300' filter='url(%23n)'/></svg>")`;

// camada de ambiente: brilho que respira e grão de filme, pra tela nunca ficar morta
function Ambiente() {
  const t = useT();
  const respira = 0.5 + 0.5 * Math.sin(t * 0.45);
  const quadro = Math.floor(t * 30);
  return (
    <>
      <div className="absolute rounded-full" style={{ left: 40, top: 520, width: 1000, height: 1000, background: `radial-gradient(circle, rgba(${P.luz},${0.09 + 0.05 * respira}), transparent 65%)`, filter: 'blur(40px)', transform: `translate(${Math.sin(t * 0.13) * 60}px, ${Math.cos(t * 0.11) * 50}px)` }} />
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: GRAO, backgroundPosition: `${(quadro * 73) % 300}px ${(quadro * 151) % 300}px`, opacity: 0.045, mixBlendMode: 'overlay' }} />
    </>
  );
}

function Cenas() {
  const t = useT();
  const escurece = clamp((t - (DURACAO - 0.9)) / 0.9);
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ color: P.osso, background: `linear-gradient(180deg, ${P.fundo} 0%, ${P.fundo2} 55%, ${P.fundo} 100%)` }}>
      <Ambiente />
      {/* a primeira cena já está na tela no quadro 0: é a capa no WhatsApp */}
      <Camada ini={0} fim={L(1).start - 0.45} entrada={0.001}>{(t) => <Pergunta t={t} />}</Camada>
      <Camada ini={L(1).start + 0.05} fim={L(2).start - 0.45}>{(t) => <Pagina t={t} />}</Camada>
      <Camada ini={L(2).start + 0.05} fim={L(3).start - 0.45}>{(t) => <Voz t={t} />}</Camada>
      <Camada ini={L(3).start - 0.1} fim={L(4).start - 0.45}>{(t) => <Palavras t={t} />}</Camada>
      <Camada ini={L(4).start + 0.05} fim={L(5).start - 0.45}>{(t) => <Quadros t={t} />}</Camada>
      <Camada ini={L(5).start - 0.1} fim={DURACAO + 5}>{(t) => <Final t={t} />}</Camada>
      <div className="absolute bottom-0 left-0 right-0 h-[380px]" style={{ background: `linear-gradient(180deg, transparent, ${P.fundo}ee 70%)` }} />
      <Legenda />
      {escurece > 0 && <div className="absolute inset-0" style={{ background: '#000', opacity: suave(escurece) }} />}
    </div>
  );
}

export default function Video() {
  return <RelogioProvider><Cenas /></RelogioProvider>;
}
