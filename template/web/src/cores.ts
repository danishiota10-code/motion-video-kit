// Cores do vídeo: o único lugar pra trocar paleta.
// OPCOES são as três candidatas que aparecem lado a lado na etapa de cores (?pagina=tipo&pal=A|B|C).
// Monte as três a partir do briefing (cores da marca, nicho, emoção que o vídeo quer passar) e, com a escolha, mude ESCOLHIDA.
// As três abaixo são só exemplo: vale qualquer cor em hex, e dá pra acrescentar D, E... pra mais rodadas.
export type Paleta = {
  nome: string;
  fundo: string; fundo2: string;  // gradiente do fundo (escuro → um pouco mais claro no meio)
  cartao: string; nota: string;   // superfícies: cartões, notificações, janelas
  destaque: string;               // a cor que chama o olho: palavra dita, destaque do título, números
  apoio: string;                  // segunda cor, pra diferenciar uma categoria da outra
  osso: string; cinza: string;    // texto principal e secundário
  luz: string;                    // r,g,b do brilho de ambiente que respira atrás das cenas
};

export const OPCOES: Record<string, Paleta> = {
  A: { nome: 'Grafite e coral', fundo: '#0B0F14', fundo2: '#142230', cartao: 'rgba(28,40,54,0.92)', nota: 'rgba(16,24,33,0.94)', destaque: '#FF7A59', apoio: '#5CE1C6', osso: '#F1F4F6', cinza: '#8C9AA8', luz: '255,122,89' },
  B: { nome: 'Petróleo e lima', fundo: '#04141A', fundo2: '#0B2A33', cartao: 'rgba(14,48,58,0.92)', nota: 'rgba(8,32,40,0.94)', destaque: '#C8F560', apoio: '#56C8F5', osso: '#EEF6F5', cinza: '#86A5A8', luz: '86,200,245' },
  C: { nome: 'Vinho e creme', fundo: '#12070A', fundo2: '#2A0F17', cartao: 'rgba(52,22,30,0.92)', nota: 'rgba(34,13,19,0.94)', destaque: '#FFB4A2', apoio: '#F6E7C1', osso: '#FBF3EE', cinza: '#B0959A', luz: '255,140,120' },
};
export const ESCOLHIDA = 'A';
export const PALETA = OPCOES[ESCOLHIDA]!;
