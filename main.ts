import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';
const here = fileURLToPath(new URL('.', import.meta.url));
const repo = resolve(here);
const out = process.env.MAKEFUN_OUTPUT_DIR || resolve(repo, 'output');
mkdirSync(out, { recursive: true });
for (const d of ['game', 'screenshots']) {
  const dst = join(out, d);
  rmSync(dst, { recursive: true, force: true });
  cpSync(join(repo, d), dst, { recursive: true });
}
const bytes = buildDossier(out, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
});
writeFileSync(join(out, 'dossier.json'), bytes);
console.log('dossier written: ' + join(out, 'dossier.json') + ' (' + bytes.length + ' bytes)');
