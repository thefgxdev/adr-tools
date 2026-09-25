#!/usr/bin/env node
// ADR Tools: create, list and supersede Architecture Decision Records. Zero dependencies, Node 18+.
// Usage: node adr.mjs new "Title" | node adr.mjs list | node adr.mjs supersede <old> <new>
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = process.env.ADR_DIR || path.join(process.cwd(), 'docs', 'adr');
const TEMPLATE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'TEMPLATE.md');
const [cmd, ...args] = process.argv.slice(2);

const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const pad = (n) => String(n).padStart(4, '0');
const records = async () => { try { return (await readdir(DIR)).filter((f) => /^\d{4}-.*\.md$/.test(f)).sort(); } catch { return []; } };
const status = (text) => (text.match(/\*\*Status:\*\*\s*([^\n]+)/) || [])[1]?.trim() || 'unknown';

if (cmd === 'new') {
  const title = args.join(' ').trim(); if (!title) { console.error('Usage: node adr.mjs new "Title"'); process.exit(1); }
  await mkdir(DIR, { recursive: true });
  const n = (await records()).length + 1, file = path.join(DIR, `${pad(n)}-${slug(title)}.md`);
  let body; try { body = await readFile(TEMPLATE, 'utf8'); } catch { body = '# ADR-NNNN: Title\n\n- **Status:** proposed\n- **Date:** YYYY-MM-DD\n\n## Context\n\n## Options considered\n\n## Decision\n\n## Consequences\n'; }
  body = body.replace('ADR-NNNN: Title in the form of a decision', `ADR-${pad(n)}: ${title}`).replace('ADR-NNNN', `ADR-${pad(n)}`).replace('YYYY-MM-DD', new Date().toISOString().slice(0, 10)).replace('proposed | accepted | superseded by ADR-XXXX', 'proposed');
  await writeFile(file, body); console.log(file);
} else if (cmd === 'list') {
  for (const f of await records()) { const t = await readFile(path.join(DIR, f), 'utf8'); console.log(`${f.slice(0, 4)}  ${status(t).padEnd(28)}  ${(t.match(/^# ADR-\d{4}: (.+)$/m) || [])[1] || f}`); }
} else if (cmd === 'supersede') {
  const [oldN, newN] = args.map(Number); if (!oldN || !newN) { console.error('Usage: node adr.mjs supersede <old> <new>'); process.exit(1); }
  const files = await records(), oldF = files.find((f) => f.startsWith(pad(oldN))); if (!oldF) { console.error(`ADR-${pad(oldN)} not found`); process.exit(1); }
  const p = path.join(DIR, oldF), t = await readFile(p, 'utf8');
  await writeFile(p, t.replace(/\*\*Status:\*\*\s*[^\n]+/, `**Status:** superseded by ADR-${pad(newN)}`)); console.log(`ADR-${pad(oldN)} superseded by ADR-${pad(newN)}`);
} else {
  console.log('Usage:\n  node adr.mjs new "Title"\n  node adr.mjs list\n  node adr.mjs supersede <old> <new>\nEnvironment: ADR_DIR (default docs/adr)');
}
