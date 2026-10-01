// Report bg-espresso-900 text-cream-50 occurrences lacking dark:bg-gold-500.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');

function walk(dir, out) {
    out = out || [];
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p, out);
        else if (p.endsWith('.vue')) out.push(p);
    }
    return out;
}

for (const f of walk(path.join(root, 'resources', 'js'))) {
    const lines = fs.readFileSync(f, 'utf8').split('\n');
    lines.forEach((ln, i) => {
        if (ln.includes('bg-espresso-900 text-cream-50') && !ln.includes('dark:bg-gold-500')) {
            console.log(path.relative(root, f) + ':' + (i + 1) + ' :: ' + ln.trim().slice(0, 130));
        }
    });
}
console.log('done');
