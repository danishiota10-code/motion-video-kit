// Etapa de elementos: o mesmo quadro com dois celulares, iPhone realista e minimalista.
// Cores de src/cores.ts, fontes de src/fontes.ts, ícones das marcas na cor do app.
import { P, TITULO, SANS, MONO } from './video/base';

// cor oficial de cada marca (Simple Icons); o glifo vai branco sobre o quadrado colorido, como o ícone do app
export const MARCAS: Record<string, string> = {
  gmail: '#EA4335', googlecalendar: '#4285F4', googledrive: '#1FA463', googledocs: '#4285F4', googlesheets: '#34A853',
  googlemeet: '#00897B', linkedin: '#0A66C2', telegram: '#26A5E4', whatsapp: '#25D366', openai: '#000000', claude: '#D97757', notion: '#FFFFFF',
};

export function IconeApp({ marca, tam = 56 }: { marca: string; tam?: number }) {
  const cor = MARCAS[marca] ?? '#333';
  const glifo = marca === 'notion' ? '#000' : '#fff';
  return (
    <div style={{ width: tam, height: tam, borderRadius: tam * 0.24, background: cor, display: 'grid', placeItems: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.35)' }}>
      <div style={{ width: tam * 0.58, height: tam * 0.58, background: glifo, WebkitMask: `url(/icons/${marca}.svg) center/contain no-repeat`, mask: `url(/icons/${marca}.svg) center/contain no-repeat` }} />
    </div>
  );
}

// ícone do assistente: quadrado dourado com o brilho do Lucide
function IconeAssistente({ tam = 56 }: { tam?: number }) {
  return (
    <div style={{ width: tam, height: tam, borderRadius: tam * 0.24, background: P.destaque, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
      <div style={{ width: tam * 0.56, height: tam * 0.56, background: P.fundo, WebkitMask: 'url(/icons/l-sparkles.svg) center/contain no-repeat', mask: 'url(/icons/l-sparkles.svg) center/contain no-repeat' }} />
    </div>
  );
}

const NOTIFS = [
  { app: 'ASSISTENTE', icone: <IconeAssistente />, quando: 'agora', titulo: 'Reunião às 9h com a Carla', corpo: 'Da última vez ela pediu a proposta revisada. Separei os valores.' },
  { app: 'ASSISTENTE', icone: <IconeAssistente />, quando: '09:30', titulo: 'Hoje é aniversário do tio', corpo: 'Quer que eu deixe uma mensagem pronta?' },
  { app: 'AGENDA', icone: <IconeApp marca="googlecalendar" />, quando: '10:00', titulo: 'Treino às 18h', corpo: 'Movi pra 19h: a reunião das 17h vai atrasar.' },
];

function TelaBloqueio({ real }: { real: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: `radial-gradient(120% 70% at 50% 0%, rgba(${P.luz},0.35) 0%, ${P.fundo2} 45%, ${P.fundo} 100%)`, borderRadius: real ? 92 : 64 }}>
      {real && (
        <div className="absolute left-0 right-0 top-[26px] flex items-center justify-between px-[56px]" style={{ fontFamily: SANS, fontWeight: 600, fontSize: 28, color: P.osso }}>
          <span>9:30</span>
          <span style={{ letterSpacing: 4, fontSize: 22 }}>●●● ◗ ▮</span>
        </div>
      )}
      <div className="absolute left-0 right-0 text-center" style={{ top: real ? 120 : 90 }}>
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 30, color: P.cinza }}>quinta-feira, 8 de outubro</div>
        <div style={{ fontFamily: TITULO, fontWeight: 600, fontSize: 190, lineHeight: 1, color: P.osso, letterSpacing: '-0.02em' }}>9:30</div>
      </div>
      <div className="absolute left-[30px] right-[30px] flex flex-col gap-[18px]" style={{ top: real ? 450 : 410 }}>
        {NOTIFS.map((n, i) => (
          <div key={i} className="flex gap-[22px] rounded-[34px] p-[24px]" style={{ background: 'rgba(255,255,255,0.09)', backdropFilter: 'blur(20px)', border: i === 0 ? `1.5px solid ${P.destaque}88` : '1px solid rgba(255,255,255,0.08)', boxShadow: i === 0 ? `0 0 40px ${P.destaque}22` : 'none' }}>
            {n.icone}
            <div className="min-w-0 flex-1" style={{ fontFamily: SANS }}>
              <div className="flex justify-between" style={{ fontFamily: MONO, fontSize: 19, letterSpacing: '0.1em' }}>
                <span style={{ color: n.app === 'ASSISTENTE' ? P.destaque : P.cinza }}>{n.app}</span><span style={{ color: P.cinza }}>{n.quando}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 30, color: P.osso, marginTop: 6 }}>{n.titulo}</div>
              <div style={{ fontWeight: 400, fontSize: 25, color: P.osso, opacity: 0.8, marginTop: 2, lineHeight: 1.3 }}>{n.corpo}</div>
            </div>
          </div>
        ))}
      </div>
      {real && <div className="absolute bottom-[20px] left-1/2 h-[8px] w-[240px] -translate-x-1/2 rounded-full" style={{ background: 'rgba(255,255,255,0.7)' }} />}
    </div>
  );
}

function Iphone() {
  // proporção do iPhone 15 Pro (~19,5:9), moldura de titânio, ilha dinâmica e botões laterais
  const w = 760, h = 1560;
  return (
    <div className="absolute left-1/2 -translate-x-1/2" style={{ top: 300, width: w, height: h }}>
      <div className="absolute" style={{ left: -6, top: 300, width: 6, height: 90, borderRadius: 3, background: '#5A5566' }} />
      <div className="absolute" style={{ left: -6, top: 420, width: 6, height: 150, borderRadius: 3, background: '#5A5566' }} />
      <div className="absolute" style={{ right: -6, top: 460, width: 6, height: 220, borderRadius: 3, background: '#5A5566' }} />
      <div className="absolute inset-0" style={{ borderRadius: 112, background: 'linear-gradient(145deg, #8B8696 0%, #3D3A47 30%, #6E6979 55%, #2E2B36 80%, #7C7787 100%)', boxShadow: `0 60px 120px rgba(0,0,0,0.6), 0 0 80px rgba(${P.luz},0.18)` }} />
      <div className="absolute" style={{ inset: 7, borderRadius: 106, background: '#000' }} />
      <div className="absolute" style={{ inset: 20 }}>
        <TelaBloqueio real />
        <div className="absolute left-1/2 top-[22px] h-[64px] w-[220px] -translate-x-1/2 rounded-full bg-black" />
      </div>
    </div>
  );
}

function Minimal() {
  const w = 720, h = 1480;
  return (
    <div className="absolute left-1/2 -translate-x-1/2" style={{ top: 330, width: w, height: h }}>
      <div className="absolute inset-0" style={{ borderRadius: 72, border: '2px solid rgba(255,255,255,0.22)', boxShadow: `0 0 0 10px rgba(255,255,255,0.03), 0 50px 120px rgba(0,0,0,0.55), 0 0 90px ${P.brilho}` }} />
      <div className="absolute" style={{ inset: 8 }}><TelaBloqueio real={false} /></div>
    </div>
  );
}

export default function Celular({ tipo }: { tipo: string }) {
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ color: P.osso, background: `linear-gradient(180deg, ${P.fundo} 0%, ${P.fundo2} 55%, ${P.fundo} 100%)` }}>
      <div className="absolute left-[140px] top-[500px] h-[900px] w-[800px] rounded-full" style={{ background: `radial-gradient(circle, ${P.brilho}, transparent 65%)`, filter: 'blur(40px)' }} />
      <h1 className="absolute left-0 right-0 top-[110px] text-center" style={{ fontFamily: TITULO, fontWeight: 700, fontSize: 84, lineHeight: 1, letterSpacing: '-0.03em' }}>
        Avisa <span style={{ color: P.destaque }}>antes</span> de você lembrar.
      </h1>
      {tipo === 'real' ? <Iphone /> : <Minimal />}
      <div className="absolute bottom-[0px] left-0 right-0 h-[300px]" style={{ background: `linear-gradient(180deg, transparent, ${P.fundo} 70%)` }} />
      <div className="absolute left-[60px] right-[60px] top-[1700px] text-center" style={{ fontFamily: SANS, fontWeight: 700, fontSize: 48, letterSpacing: '-0.015em', lineHeight: 1.2 }}>
        <span>Eu aviso antes dele </span><span style={{ color: P.destaque }}>lembrar</span><span style={{ opacity: 0.35 }}>: quem ele vai encontrar</span>
      </div>
      <div className="absolute bottom-[40px] left-0 right-0 text-center" style={{ fontFamily: MONO, fontSize: 22, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em' }}>{tipo === 'real' ? 'IPHONE REALISTA' : 'MINIMALISTA'}</div>
    </div>
  );
}
