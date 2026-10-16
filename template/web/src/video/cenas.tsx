// Cenas do vídeo de exemplo (scripts/roteiro-exemplo.json). Cada cena recebe o tempo t do relógio
// e prende o que aparece nas falas: L(i).start (começo da frase i) e W(i, 'palavra') (quando a palavra é dita).
// Num vídeo novo, reescreva este arquivo e o Video.tsx a partir do seu roteiro.
import { P, SANS, MONO, TITULO, L, W, Titulo, IconeApp, Lucide, clamp, entra, mola, suave } from './base';

// 0: a pergunta do gancho, com um relógio girando devagar (nada fica parado)
export function Pergunta({ t }: { t: number }) {
  const gira = t * 24;
  return (
    <>
      <Titulo txt="Quanto tempo você levaria pra fazer *um vídeo assim?*" t0={-9} top={560} tam={124} />
      <div className="absolute left-1/2 top-[1080px]" style={{ width: 220, height: 220, marginLeft: -110 }}>
        <div className="absolute inset-0 rounded-full" style={{ border: `3px solid ${P.destaque}66`, boxShadow: `0 0 60px ${P.destaque}22` }} />
        <div className="absolute left-1/2 top-1/2" style={{ width: 4, height: 80, marginLeft: -2, marginTop: -80, background: P.destaque, borderRadius: 2, transformOrigin: 'bottom center', transform: `rotate(${gira}deg)` }} />
        <div className="absolute left-1/2 top-1/2" style={{ width: 4, height: 54, marginLeft: -2, marginTop: -54, background: P.osso, borderRadius: 2, transformOrigin: 'bottom center', transform: `rotate(${gira / 12}deg)` }} />
      </div>
    </>
  );
}

// 1: uma janela de navegador; o código à esquerda vira a cena à direita
const CODIGO = ['<Camada ini={L(1).start}>', '  <Titulo txt="Olá" />', '  <IconeApp marca="gmail" />', '</Camada>'];
export function Pagina({ t }: { t: number }) {
  const t0 = L(1).start;
  const vira = mola(t - W(1, 'página'));
  return (
    <>
      <Titulo txt="Cada cena é uma *página web.*" t0={t0} top={230} tam={104} />
      <div className="absolute left-[70px] right-[70px] top-[620px] overflow-hidden rounded-[30px] border border-white/10" style={{ background: P.nota, height: 760, boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }}>
        <div className="flex items-center gap-3 px-7 py-5" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <span key={c} className="h-5 w-5 rounded-full" style={{ background: c }} />)}
          <span className="ml-5 rounded-full px-6 py-2" style={{ fontFamily: MONO, fontSize: 22, color: P.cinza, background: 'rgba(255,255,255,0.06)' }}>localhost:5173/?pagina=video</span>
        </div>
        <div className="p-10" style={{ fontFamily: MONO, fontSize: 30, lineHeight: 1.7, opacity: 1 - vira * 0.75 }}>
          {CODIGO.map((c, i) => {
            const a = entra((t - t0 - 0.3 - i * 0.25) / 0.4);
            return <div key={i} style={{ opacity: a, transform: `translateX(${(1 - a) * -30}px)`, color: i === 0 || i === 3 ? P.apoio : P.osso, whiteSpace: 'pre' }}>{c}</div>;
          })}
        </div>
        {vira > 0 && (
          <div className="absolute inset-x-0 bottom-0 top-[86px] grid place-items-center" style={{ opacity: vira, transform: `scale(${0.9 + 0.1 * vira})` }}>
            <div className="flex flex-col items-center gap-8">
              <div style={{ fontFamily: TITULO, fontWeight: 700, fontSize: 120, color: P.osso }}>Olá</div>
              <IconeApp marca="gmail" tam={120} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// 2: a voz em takes, uma frase por take, com a onda respirando
export function Voz({ t }: { t: number }) {
  const t0 = L(2).start;
  const takes = ['00_0.wav', '01_0.wav', '02_0.wav', '03_0.wav'];
  return (
    <>
      <Titulo txt="A voz é gerada *frase por frase.*" t0={t0} top={230} tam={104} />
      <div className="absolute left-[90px] right-[90px] top-[640px] flex flex-col gap-6">
        {takes.map((n, i) => {
          const a = entra((t - t0 - 0.2 - i * 0.3) / 0.45);
          const ativo = i === Math.floor(clamp((t - t0) / 0.7, 0, 3.99));
          return (
            <div key={n} className="flex items-center gap-6 rounded-[26px] px-7 py-6" style={{ background: P.cartao, opacity: a, transform: `translateY(${(1 - a) * 30}px)`, border: ativo ? `1.5px solid ${P.destaque}88` : '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontFamily: MONO, fontSize: 24, color: ativo ? P.destaque : P.cinza, width: 150 }}>{n}</span>
              <div className="flex flex-1 items-center gap-[6px]" style={{ height: 70 }}>
                {Array.from({ length: 34 }, (_, k) => {
                  const h = 12 + 50 * Math.abs(Math.sin(k * 1.7 + i * 2.3)) * (ativo ? 0.7 + 0.3 * Math.sin(t * 9 + k) : 0.55);
                  return <span key={k} className="flex-1 rounded-full" style={{ height: h, background: ativo ? P.destaque : P.cinza + '88' }} />;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// 3: as palavras do roteiro, cada uma acendendo no instante em que é dita
export function Palavras({ t }: { t: number }) {
  const linha = L(3);
  return (
    <>
      <div className="absolute left-0 right-0 top-[300px] text-center" style={{ fontFamily: MONO, fontSize: 28, letterSpacing: '0.3em', color: P.cinza }}>W(3, 'palavra')</div>
      <div className="absolute left-[80px] right-[80px] top-[520px] flex flex-wrap justify-center gap-x-6 gap-y-4" style={{ fontFamily: TITULO, fontWeight: 700, fontSize: 104, lineHeight: 1.1 }}>
        {linha.words.map((p, i) => {
          const dita = clamp((t - p.start + 0.05) / 0.2);
          const destaque = /anima|palavra/i.test(p.w);
          return <span key={i} style={{ color: destaque && dita > 0 ? P.destaque : P.osso, opacity: 0.25 + 0.75 * dita, transform: `translateY(${(1 - dita) * 16}px)` }}>{p.w}</span>;
        })}
      </div>
      {linha.words.map((p, i) => {
        const x = 120 + (840 * (p.start - linha.start)) / Math.max(0.1, linha.end - linha.start);
        const a = clamp((t - p.start) / 0.15);
        return <div key={i} className="absolute top-[1240px] rounded-full" style={{ left: x - 9, width: 18, height: 18, background: P.destaque, opacity: a, transform: `scale(${0.6 + 0.4 * a})` }} />;
      })}
      <div className="absolute left-[120px] right-[120px] top-[1248px] h-[2px]" style={{ background: P.cinza + '55' }} />
    </>
  );
}

// 4: a fita de quadros correndo e o contador subindo
export function Quadros({ t }: { t: number }) {
  const t0 = L(4).start;
  const quadro = Math.max(0, Math.floor((t - t0) * 30));
  const corre = (t - t0) * 180;
  return (
    <>
      <Titulo txt="Gravado *quadro a quadro.*" t0={t0} top={230} tam={110} />
      <div className="absolute left-0 right-0 top-[700px] overflow-hidden" style={{ height: 420 }}>
        <div className="absolute flex gap-6" style={{ left: -corre % 330, top: 30 }}>
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="grid place-items-center rounded-[22px] border border-white/10" style={{ width: 306, height: 360, background: P.cartao }}>
              <Lucide nome={['sparkles', 'mail', 'calendar', 'target'][i % 4]!} cor={i % 2 ? P.apoio : P.destaque} tam={110} />
            </div>
          ))}
        </div>
      </div>
      <div className="absolute left-0 right-0 top-[1200px] text-center" style={{ fontFamily: MONO, fontSize: 64, color: P.destaque }}>quadro {String(quadro).padStart(4, '0')}</div>
      <div className="absolute left-0 right-0 top-[1300px] text-center" style={{ fontFamily: SANS, fontSize: 32, color: P.cinza }}>30 por segundo · 1080 × 1920</div>
    </>
  );
}

// 5: o fechamento, que fica na tela até o fim
export function Final({ t }: { t: number }) {
  const t0 = L(5).start;
  const brilho = suave((t - t0) / 1.2);
  return (
    <>
      <div className="absolute rounded-full" style={{ left: 190, top: 560, width: 700, height: 700, background: `radial-gradient(circle, ${P.destaque}33, transparent 65%)`, opacity: brilho, filter: 'blur(30px)' }} />
      <Titulo txt="Agora é a *sua vez.*" t0={t0} top={820} tam={150} />
    </>
  );
}
