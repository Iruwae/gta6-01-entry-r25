import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = fileURLToPath(new URL('.', import.meta.url));
const root = join(resolve(here), 'game');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.json': 'application/json' };
const args = process.argv.slice(2);
const pi = args.indexOf('--port');
const port = pi >= 0 ? Number(args[pi + 1]) : 8901;
createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  const p = url === '/' ? '/index.html' : url;
  const f = join(root, p);
  if (!f.startsWith(root) || !existsSync(f) || !statSync(f).isFile()) { res.writeHead(404); res.end('nf'); return; }
  res.writeHead(200, { 'Content-Type': types[extname(f)] || 'application/octet-stream' });
  res.end(readFileSync(f));
}).listen(port, '127.0.0.1', () => console.log('serve on ' + port));
