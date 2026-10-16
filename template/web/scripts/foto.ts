#!/usr/bin/env bun
// Foto estática de uma página (quadros de comparação): bun scripts/foto.ts "pagina=tipo&op=A" saida.png
import { chromium } from 'playwright-core';
import path from 'node:path';
const [query, out] = process.argv.slice(2);
const APP = path.resolve(import.meta.dir, '..');
const port = 5900 + Math.floor(Math.random() * 90);
const vite = Bun.spawn(['bunx', 'vite', '--port', String(port), '--strictPort'], { cwd: APP, stdout: 'ignore', stderr: 'inherit', env: { ...process.env, NO_HMR: '1' } });
const url = `http://localhost:${port}`;
for (let i = 0; i < 100; i++) { try { if ((await fetch(url)).ok) break; } catch {} await Bun.sleep(100); }
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--force-color-profile=srgb'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
for (const q of query!.split('|')) {
  await page.goto(`${url}/?${q}`);
  await page.waitForFunction(() => (window as any).__ready === true, null, { timeout: 30000 });
  await Bun.sleep(300);
  const o = query!.includes('|') ? out!.replace('.png', `-${new URLSearchParams(q).get('pal') ?? new URLSearchParams(q).get('op')}.png`) : out!;
  await page.screenshot({ path: path.resolve(o) });
  console.log('ok', o);
}
await browser.close(); vite.kill();
