// Syntax gate v2: uses Node's real parser via `node --check` on temp copies.
// Emitted for + verified by scripts, pure JS, no native deps.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'saveur-check-'));

function walk(dir, out) {
    out = out || [];
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p, out);
        else if (e.name.endsWith('.js')) out.push(p);
    }
    return out;
}

const files = walk(path.join(root, 'public', 'build', 'js')).concat(
    walk(path.join(root, 'public', 'build', 'vendor'))
);
let bad = 0;
for (const f of files) {
    const t = path.join(tmp, 'c.mjs');
    fs.copyFileSync(f, t);
    try {
        execFileSync(process.execPath, ['--check', t], { stdio: 'pipe' });
    } catch (e) {
        console.log('SYNTAX FAIL ' + path.relative(root, f) + ': ' + String(e.stderr || e.message).split('\n').slice(0, 4).join(' | '));
        bad++;
    }
}
fs.rmSync(tmp, { recursive: true, force: true });
console.log(bad === 0 ? 'SYNTAX GATE OK (' + files.length + ' files, node parser)' : bad + ' BAD FILES');
process.exit(bad === 0 ? 0 : 1);
