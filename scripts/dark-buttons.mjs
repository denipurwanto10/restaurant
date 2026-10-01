// Batch 2: primary espresso buttons -> gold in dark mode (regex-based).
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

const DARK_BTN = 'dark:bg-gold-500 dark:text-espresso-900';
const DARK_HOVER = 'dark:hover:bg-gold-400';

let touched = 0;
for (const f of walk(path.join(root, 'resources', 'js'))) {
    let src = fs.readFileSync(f, 'utf8');
    let changed = false;
    // class="... bg-espresso-900 text-cream-50 ... hover:bg-espresso-700 ..." (static + ternary literals)
    src = src.replace(/bg-espresso-900 text-cream-50([^"']*?)hover:bg-espresso-700/g, (m, mid) => {
        if (mid.includes('dark:bg-gold-500')) return m;
        changed = true;
        return 'bg-espresso-900 text-cream-50' + mid + 'hover:bg-espresso-700 ' + DARK_BTN + ' ' + DARK_HOVER;
    });
    // ternary-selected chips: 'bg-espresso-900 text-cream-50 ...' without hover
    src = src.replace(/'(bg-espresso-900 text-cream-50)([^"']*?)'/g, (m, head, mid) => {
        if (mid.includes('dark:bg-gold-500') || mid.includes('hover:bg-espresso-700')) return m;
        changed = true;
        return "'" + head + mid + (mid.endsWith(' ') ? '' : ' ') + DARK_BTN + "'";
    });
    if (changed) {
        fs.writeFileSync(f, src);
        touched++;
    }
}
console.log('button batch touched files: ' + touched);
