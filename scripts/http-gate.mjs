// HTTP gate: every built asset + SPA routes + key API endpoints must return 2xx.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const base = 'http://127.0.0.1:8000';

function walk(dir, out) {
    out = out || [];
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p, out);
        else out.push(p);
    }
    return out;
}

const urls = ['/'];
for (const f of walk(path.join(root, 'public', 'build'))) {
    urls.push('/build/' + path.relative(path.join(root, 'public', 'build'), f).split(path.sep).join('/'));
}
urls.push('/menu', '/branches', '/login', '/admin', '/api/menus?per_page=2', '/api/branches', '/api/payment-methods', '/api/promos');

let bad = 0;
for (const u of urls) {
    try {
        const r = await fetch(base + u);
        if (!r.ok) {
            console.log('HTTP ' + r.status + ' ' + u);
            bad++;
        }
    } catch (e) {
        console.log('FETCH FAIL ' + u + ': ' + e.message);
        bad++;
    }
}
console.log(bad === 0 ? 'HTTP GATE OK (' + urls.length + ' urls)' : bad + ' BAD URLS');
process.exit(bad === 0 ? 0 : 1);
