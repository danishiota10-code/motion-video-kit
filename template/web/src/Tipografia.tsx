// Etapa de tipografia: o mesmo quadro em três famílias de tipo, pra comparar lado a lado.
// Tem todos os papéis de texto do vídeo: rótulo, título, número grande, notificação, nota .md e legenda.
// e a etapa de cores: o mesmo quadro com cada paleta candidata (?pagina=tipo&pal=A|B|C).
import { OPCOES, FONTE, q } from './fontes';
import { OPCOES as PALETAS, PALETA } from './cores';

export default function Tipografia({ op, pal }: { op: string; pal?: string }) {
  const f = OPCOES[op] ?? FONTE;
  const o = { titulo: q(f.titulo), tituloPeso: f.tituloPeso, tituloTam: 120 * f.escala, tituloTrack: f.track, italico: f.italico, texto: q(f.texto), mono: q(f.mono), numero: q(f.titulo), nome: f.nome };
  const P = (pal && PALETAS[pal]) || PALETA;
  const { destaque: ouro, osso, cinza, apoio: azul } = P;
  const brilho = `rgba(${P.luz},0.14)`;
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ color: osso, background: `linear-gradient(180deg, ${P.fundo} 0%, ${P.fundo2} 55%, ${P.fundo} 100%)` }}>
      <div className="absolute left-[240px] top-[300px] h-[700px] w-[700px] rounded-full" style={{ background: `radial-gradient(circle, ${brilho}, transparent 65%)`, filter: 'blur(40px)' }} />

      <div className="absolute left-0 right-0 top-[130px] text-center" style={{ fontFamily: o.mono, fontSize: 26, letterSpacing: '0.32em', color: ouro }}>MOTION AS CODE</div>

      <h1 className="absolute left-[60px] right-[60px] top-[190px] text-center" style={{ fontFamily: o.titulo, fontWeight: o.tituloPeso, fontSize: o.tituloTam, letterSpacing: o.tituloTrack, lineHeight: 1.0 }}>
        Tudo que você sabe,<br />
        <span style={{ color: ouro, fontStyle: o.italico ? 'italic' : 'normal' }}>conectado.</span>
      </h1>

      <div className="absolute left-0 right-0 top-[500px] text-center">
        <div style={{ fontFamily: o.numero, fontWeight: o.tituloPeso, fontSize: o.italico ? 300 : 260, letterSpacing: '-0.05em', lineHeight: 1, color: ouro }}>86</div>
        <div style={{ fontFamily: o.texto, fontWeight: 500, fontSize: 36, color: cinza, marginTop: 8 }}>reuniões no último mês</div>
      </div>

      <div className="absolute left-[70px] right-[70px] top-[940px] rounded-[34px] border border-white/10 p-8" style={{ background: P.cartao, fontFamily: o.texto }}>
        <div className="flex justify-between" style={{ fontFamily: o.mono, fontSize: 22, letterSpacing: '0.12em' }}>
          <span style={{ color: ouro }}>ASSISTENTE</span><span style={{ color: cinza }}>09:30</span>
        </div>
        <div style={{ fontWeight: 700, fontSize: 40, marginTop: 14, letterSpacing: '-0.01em' }}>Hoje é aniversário do tio</div>
        <div style={{ fontWeight: 400, fontSize: 32, color: cinza, marginTop: 6, lineHeight: 1.35 }}>Quer que eu deixe uma mensagem pronta?</div>
      </div>

      <div className="absolute left-[70px] right-[70px] top-[1210px] rounded-[34px] border border-white/10 p-9" style={{ background: P.nota, fontFamily: o.mono, fontSize: 30, lineHeight: 1.6 }}>
        <div style={{ color: cinza, fontSize: 22, marginBottom: 12 }}>● reuniao-com-a-carla.md</div>
        <div style={{ color: cinza }}>## Decisões</div>
        <div>- <span style={{ color: ouro, background: ouro + '24', borderRadius: 6, padding: '0 4px' }}>[[Carla Mendes]]</span> aprova a <span style={{ color: ouro, background: ouro + '24', borderRadius: 6, padding: '0 4px' }}>[[Proposta Q4]]</span></div>
        <div>- férias: <span style={{ color: azul, background: azul + '24', borderRadius: 6, padding: '0 4px' }}>[[Viagem a Lisboa]]</span></div>
      </div>

      <div className="absolute left-[60px] right-[60px] top-[1640px] text-center" style={{ fontFamily: o.texto, fontWeight: 700, fontSize: 50, letterSpacing: '-0.015em', lineHeight: 1.2 }}>
        <span style={{ color: osso }}>Eu aviso antes dele </span><span style={{ color: ouro }}>lembrar</span><span style={{ color: osso, opacity: 0.35 }}>: quem ele vai encontrar</span>
      </div>

      <div className="absolute bottom-[60px] left-0 right-0 text-center" style={{ fontFamily: o.mono, fontSize: 22, color: osso, opacity: 0.3, letterSpacing: '0.2em' }}>{pal ? `PALETA ${pal} · ${P.nome.toUpperCase()}` : `OPÇÃO ${op} · ${o.nome.toUpperCase()}`}</div>
    </div>
  );
}
