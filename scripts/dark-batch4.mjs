// Batch 4: generic pass — any class literal with a light color token but no
// corresponding dark: variant gets one appended. Idempotent.
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

// [token regex, dark-absence test, dark class to append]
const RULES = [
    [/text-espresso-(700|800)\/\d+/, 'dark:text-', 'dark:text-cream-200'],
    [/text-espresso-700(?![\/\d])/, 'dark:text-', 'dark:text-cream-200'],
    [/text-espresso-500\/\d+/, 'dark:text-', 'dark:text-cream-200/70'],
    [/text-red-[67]00(?:\/\d+)?/, 'dark:text-', 'dark:text-red-400'],
    [/text-green-[78]00(?:\/\d+)?/, 'dark:text-', 'dark:text-green-400'],
    [/text-gold-600(?:\/\d+)?/, 'dark:text-', 'dark:text-gold-400'],
    [/hover:text-espresso-(900|600)/, 'dark:hover:text-', 'dark:hover:text-gold-400'],
    [/hover:border-espresso-900(?:\/\d+)?/, 'dark:hover:border-', 'dark:hover:border-gold-400'],
    [/border-espresso-900(?![\/\w-])/, 'dark:border-', 'dark:border-gold-500'],
    [/border-espresso-900\/\d+/, 'dark:border-', 'dark:border-white/20'],
];

let files = 0;
let insertions = 0;
for (const f of walk(path.join(root, 'resources', 'js'))) {
    let src = fs.readFileSync(f, 'utf8');
    let changed = false;
    // process every quoted literal (static class="..." and ternary '...')
    src = src.replace(/("[^"\n]*"|'[^'\n]*')/g, (lit) => {
        let out = lit;
        // Skip JS ternaries: appending a dark: class to the whole expression
        // would leak it into BOTH branches. Those are fixed manually.
        if (lit.includes('?')) return lit;
        for (const [re, absence, add] of RULES) {
            if (re.test(out) && !out.includes(absence) && !out.includes(add)) {
                const q = out[out.length - 1];
                out = out.slice(0, -1) + (out.endsWith(' ') ? '' : ' ') + add + q;
                insertions++;
            }
        }
        if (out !== lit) changed = true;
        return out;
    });
    if (changed) {
        fs.writeFileSync(f, src);
        files++;
    }
}
console.log('batch4: ' + insertions + ' insertions in ' + files + ' files');
