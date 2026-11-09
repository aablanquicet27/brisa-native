// Genera las imágenes fuente de la app nativa (native/resources/*.png) con la marca de Brisa.
// Luego, en CI, `npx @capacitor/assets generate` saca de aquí todos los tamaños de iOS y Android.
// Uso (en el servidor, con Playwright ya instalado en brisa-app): node native/scripts/assets.mjs
import { chromium } from '/home/ubuntu/brisa-app/node_modules/playwright-core/index.mjs';
const shell = process.env.HOME + '/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const OUT = new URL('../resources/', import.meta.url).pathname;

const BG = 'radial-gradient(70% 60% at 32% 30%,#363c68 0%,transparent 70%),linear-gradient(160deg,#2a2f55 0%,#1b2140 100%)';
const BG_SPLASH = 'linear-gradient(180deg,#1b2140 0%,#2a2f55 62%,#363c68 100%)';
// La marca: círculo claro con la onda (igual que el ícono maskable de la web)
const mark = (px) => `<svg viewBox="0 0 24 24" style="width:${px}px;height:${px}px"><circle cx="12" cy="12" r="10" fill="#fff"/><path d="M6.5 13.2c1.8-1.7 3.7-1.7 5.5 0s3.7 1.7 5.5 0" fill="none" stroke="#1b2140" stroke-width="1.7" stroke-linecap="round"/></svg>`;
const page = (bg, inner) => `<!doctype html><html><body style="margin:0;width:100vw;height:100vh;background:${bg};display:grid;place-items:center">${inner}</body></html>`;

const JOBS = [
  // ícono de iOS / ícono heredado de Android: fondo lleno (sin transparencia), marca al ~33 %
  ['icon-only.png', 1024, page(BG, mark(340))],
  // ícono adaptable de Android: primer plano transparente (zona segura = 66 % central) y fondo aparte
  ['icon-foreground.png', 1024, page('transparent', mark(300))],
  ['icon-background.png', 1024, page(BG, '')],
  // pantalla de arranque (centrada, se recorta a cada proporción)
  ['splash.png', 2732, page(BG_SPLASH, mark(200))],
  ['splash-dark.png', 2732, page(BG_SPLASH, mark(200))],
];

const browser = await chromium.launch({ executablePath: shell });
for (const [name, size, html] of JOBS) {
  const p = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
  await p.setContent(html);
  await p.screenshot({ path: OUT + name, omitBackground: name.includes('foreground') });
  await p.close();
  console.log('ok', name);
}
await browser.close();
