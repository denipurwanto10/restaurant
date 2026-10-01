// Report remaining light surfaces/borders/hovers lacking dark: variants.
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

const CHECKS = [
    ['bg-white (no dark:bg)', /\bbg-white\b/, /dark:bg-/],
    ['bg-cream-50/100 (no dark:bg)', /\bbg-cream-(50|100)\b/, /dark:bg-/],
    ['border-cream (no dark:border)', /\bborder-cream-\d+/, /dark:border-/],
    ['hover:bg-cream (no dark:hover)', /\bhover:bg-cream-\d+/, /dark:hover:bg-/],
    ['bg-green/red-50 (no dark:bg)', /\bbg-(green|red)-50\b/, /dark:bg-/],
    ['text-cream-200/xx (bare, on dark card?)', /\btext-cream-200\/\d+/, /DUMMY-NEVER/],
];

for (const f of walk(path.join(root, 'resources', 'js'))) {
    const lines = fs.readFileSync(f, 'utf8').split('\n');
    lines.forEach((ln, i) => {
        if (!ln.includes('class')) return;
        for (const [label, re, absence] of CHECKS) {
            if (re.test(ln) && !absence.test(ln)) {
                console.log(path.relative(root, f) + ':' + (i + 1) + ' [' + label + '] ' + ln.trim().slice(0, 140));
            }
        }
    });
}
console.log('done');
