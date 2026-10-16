#!/usr/bin/env bun
// Grava a página quadro a quadro com um relógio falso: o Playwright substitui Date, performance.now, setTimeout
// e requestAnimationFrame, e cada quadro avança exatamente 1/fps. O Motion roda no relógio falso porque o
// Element.prototype.animate é removido antes da página carregar (sem WAAPI ele anima pelo requestAnimationFrame).
// Animações CSS puras são pausadas e posicionadas à mão em cada quadro.
//   bun scripts/render.ts --dur 8 --fps 30 --out ../out/teste.mp4 [--query pagina=clipe&op=1] [--stills 1,2.5,4] [--frames dir]
//   --ini 81.5: grava só a partir desse instante (clipe de um trecho do vídeo; a --dur continua contando do zero)
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const opt = (k: string, d: string) => { const i = argv.indexOf(`--${k}`); return i >= 0 ? argv[i + 1]! : d; };
const FPS = +opt('fps', '30'), DUR = +opt('dur', '8');
const OUT = path.resolve(opt('out', '../out/teste.mp4'));
const STILLS = opt('stills', '').split(',').filter(Boolean).map(Number);
const FRAMES = opt('frames', '');
const QUERY = opt('query', '');
const SO_STILLS = argv.includes('--so-stills'); // só tira as fotos dos instantes pedidos, sem gerar vídeo
const AUDIO = opt('audio', '');
const INI = +opt('ini', '0');
const APP = path.resolve(import.meta.dir, '..');

const port = 5600 + Math.floor(Math.random() * 300);
const vite = Bun.spawn(['bunx', 'vite', '--port', String(port), '--strictPort'], { cwd: APP, stdout: 'ignore', stderr: 'inherit', env: { ...process.env, NO_HMR: '1' } });
const url = `http://localhost:${port}`;
for (let i = 0; i < 100; i++) { try { if ((await fetch(url)).ok) break; } catch {} await Bun.sleep(100); }

const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--force-color-profile=srgb', '--disable-background-timer-throttling', '--disable-renderer-backgrounding'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
const logs: string[] = [];
page.on('pageerror', (e) => logs.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') logs.push(m.text()); });
await page.addInitScript(() => { delete (Element.prototype as any).animate; (window as any).__render = true; });
await page.clock.install({ time: 0 });
await page.goto(QUERY ? `${url}/?${QUERY}` : url);
for (let i = 0; i < 300; i++) { if (await page.evaluate(() => (window as any).__ready === true)) break; await Bun.sleep(100); }
const t0 = 100000;
await page.clock.pauseAt(t0);
await page.evaluate(() => (window as any).__go());

mkdirSync(path.dirname(OUT), { recursive: true });
if (FRAMES) mkdirSync(FRAMES, { recursive: true });
const ff = Bun.spawn(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'png', '-r', String(FPS), '-i', 'pipe:0',
  ...(AUDIO ? ['-ss', String(INI), '-i', path.resolve(AUDIO)] : []),
  '-vf', 'scale=out_color_matrix=bt709,setparams=color_primaries=bt709:color_trc=bt709', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', ...(AUDIO ? ['-c:a', 'aac', '-b:a', '256k', '-shortest'] : []), '-movflags', '+faststart', OUT], { stdin: 'pipe' });

const total = Math.round(DUR * FPS);
const f0 = Math.round(INI * FPS);
const inicio = performance.now();
let feito = 0;
for (let f = 0; f < total; f++) {
  const alvo = Math.round((f * 1000) / FPS);
  if (alvo > feito) { await page.clock.runFor(alvo - feito); feito = alvo; }
  await page.evaluate((T) => {
    const w = window as any;
    w.__nasc ??= new WeakMap();
    for (const a of document.getAnimations()) {
      if (!w.__nasc.has(a)) w.__nasc.set(a, T);
      a.pause(); a.currentTime = T - w.__nasc.get(a);
    }
  }, alvo);
  const t = f / FPS;
  if (t < INI - 1e-6) continue;
  const foto = FRAMES && STILLS.some((s) => Math.round(s * FPS) === f);
  if (SO_STILLS && !foto) continue;
  const png = await page.screenshot({ type: 'png' });
  if (!SO_STILLS) ff.stdin.write(png);
  if (foto) await Bun.write(path.join(FRAMES, `t${t.toFixed(2).padStart(6, '0')}.png`), png);
  if (f % 30 === 0) process.stdout.write(`\r${f}/${total}`);
}
ff.stdin.end();
await ff.exited;
await browser.close();
vite.kill();
const seg = (performance.now() - inicio) / 1000;
console.log(`\nok ${OUT} (${total - f0} quadros em ${seg.toFixed(1)} s, ${(seg / (total - f0) * 1000).toFixed(0)} ms/quadro)`);
if (logs.length) console.log('ERROS NA PÁGINA:\n' + logs.join('\n'));
