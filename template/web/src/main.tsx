import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import './index.css';
import Tipografia from './Tipografia';
import Celular from './Celular';
import Video from './video/Video';
import Capa from './video/Capa';
import { carregarFontes } from './fontes';
// ?pagina=video (padrão) | capa&op=A | tipo&op=A|B|C | tipo&pal=A|B|C | celular&op=real|minimal
const q = new URLSearchParams(location.search);
const pagina = q.get('pagina') ?? 'video';
const cena = pagina === 'capa' ? <Capa op={q.get('op') ?? 'A'} /> : pagina === 'celular' ? <Celular tipo={q.get('op') ?? 'real'} /> : pagina === 'tipo' ? <Tipografia op={q.get('op') ?? ''} pal={q.get('pal') ?? undefined} /> : <Video />;
const root = createRoot(document.getElementById('root')!);
const go = () => flushSync(() => root.render(cena));
// no render, a cena só monta quando o relógio falso está parado no zero; no navegador, monta direto
if ((window as any).__render) (window as any).__go = go; else go();
// o gravador só começa quando as fontes (src/fontes.ts) terminaram de carregar
carregarFontes().then(() => { (window as any).__ready = true; });
