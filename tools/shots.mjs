// Headless screenshot capture for SOLMAR BAY (Node 22, stdlib only).
// Serves game/ on a local port, loads each ?shot= scene in the Playwright
// headless shell over CDP, waits for window.__shotReady, captures a JPEG
// (1280x720, quality 80, re-tried lower if over the 256 KiB cap) into
// screenshots/.
//
//   node tools/shots.mjs
//   node tools/shots.mjs --port 8901 --out screenshots
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, statSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const repo = resolve(here, '..');
const args = process.argv.slice(2);
const portIndex = args.indexOf('--port');
const port = portIndex >= 0 ? Number(args[portIndex + 1]) : 8901;
const outIndex = args.indexOf('--out');
const outDir = resolve(repo, outIndex >= 0 ? args[outIndex + 1] : 'screenshots');
const SHELL = `${process.env.HOME}/.cache/ms-playwright/chromium_headless_shell-1148/chrome-linux/headless_shell`;

const shots = JSON.parse(readFileSync(join(repo, 'shots.json'), 'utf8'));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitFor(url, timeoutMs, label) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch { /* not up yet */ }
    await sleep(250);
  }
  throw new Error(`timed out waiting for ${label}: ${url}`);
}

// --- CDP client (global WebSocket, Node 22) ---
let msgId = 0;
const pending = new Map();
let ws;
const consoleErrors = [];

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++msgId;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function main() {
  mkdirSync(outDir, { recursive: true });
  const server = spawn('node', ['serve.ts', '--port', String(port)], { cwd: repo, stdio: 'ignore' });
  const browser = spawn(SHELL, [
    '--no-sandbox', '--disable-gpu', '--use-gl=angle', '--use-angle=swiftshader',
    '--hide-scrollbars', '--window-size=1280,720',
    '--remote-debugging-port=9223', 'about:blank',
  ], { stdio: 'ignore' });
  try {
    await waitFor(`http://127.0.0.1:${port}/index.html`, 10000, 'game server');
    await waitFor('http://127.0.0.1:9223/json/version', 15000, 'headless shell');
    const targets = await (await fetch('http://127.0.0.1:9223/json/list')).json();
    const page = targets.find((t) => t.type === 'page');
    if (!page) throw new Error('no page target in headless shell');
    ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });
    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      } else if (msg.method === 'Runtime.exceptionThrown') {
        const d = msg.params.exceptionDetails;
        consoleErrors.push(`EXCEPTION ${d.text} ${d.exception?.description || ''}`);
      } else if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
        consoleErrors.push('CONSOLE ' + msg.params.args.map((a) => a.value ?? a.description ?? '').join(' '));
      }
    };
    await send('Page.enable');
    await send('Runtime.enable');
    for (const shot of shots) {
      consoleErrors.length = 0;
      const url = `http://127.0.0.1:${port}/index.html${shot.query}`;
      await send('Page.navigate', { url });
      let ready = false;
      const start = Date.now();
      while (Date.now() - start < 30000) {
        await sleep(500);
        const r = await send('Runtime.evaluate', { expression: 'window.__shotReady === true', returnByValue: true });
        if (r.result && r.result.value === true) { ready = true; break; }
      }
      if (!ready) {
        console.log(`SHOT ${shot.name}: NOT READY after 30s — skipped`);
        if (consoleErrors.length) console.log('  errors:\n  ' + consoleErrors.join('\n  '));
        continue;
      }
      let quality = 80;
      let buf = null;
      for (const q of [80, 60, 45]) {
        const shot2 = await send('Page.captureScreenshot', { format: 'jpeg', quality: q, clip: { x: 0, y: 0, width: 1280, height: 720, scale: 1 } });
        buf = Buffer.from(shot2.data, 'base64');
        if (buf.length <= 262144) { quality = q; break; }
        quality = q;
      }
      const outPath = join(outDir, shot.name);
      writeFileSync(outPath, buf);
      const size = statSync(outPath).size;
      console.log(`SHOT ${shot.name}: ${size} bytes (quality ${quality}) ${size <= 262144 ? 'OK' : 'OVER 256 KiB!'}`);
      if (consoleErrors.length) console.log('  errors:\n  ' + consoleErrors.join('\n  '));
    }
  } finally {
    try { ws?.close(); } catch { /* already closed */ }
    browser.kill('SIGKILL');
    server.kill('SIGKILL');
  }
}

main().catch((e) => { console.error('shots tool failed:', e.message); process.exit(1); });
