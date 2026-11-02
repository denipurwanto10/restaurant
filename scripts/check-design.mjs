// Design-system lint: keeps new screens consistent with the Saveur redesign.
// Usage: node scripts/check-design.mjs   (exit 1 when something is off)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const jsRoot = path.join(root, 'resources', 'js');

function walk(dir, out = []) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p, out);
        else if (p.endsWith('.vue')) out.push(p);
    }
    return out;
}

// Retired palette values and legacy radii that should not come back.
const RULES = [
    ['legacy colour', /#(211a12|14100b|2c2318|f5f1e8|a67c28|3e3222)/i],
    ['legacy radius (use rounded-[1.25rem] / [1.75rem] / [0.875rem])', /\brounded-(xl|2xl|3xl)\b/],
    ['legacy eyebrow (use text-[11px] font-medium tracking-[0.22em])', /text-xs font-bold uppercase tracking-\[0\.2em\]/],
    ['toggle dark mode through useTheme(), not by hand', /classList\.(add|toggle)\('dark'/],
];

let problems = 0;
for (const f of walk(jsRoot)) {
    const rel = path.relative(root, f);
    const src = fs.readFileSync(f, 'utf8');
    src.split('\n').forEach((ln, i) => {
        for (const [label, re] of RULES) {
            if (re.test(ln) && !rel.endsWith('theme.js')) {
                problems++;
                console.log(`${rel}:${i + 1} [${label}] ${ln.trim().slice(0, 110)}`);
            }
        }
    });
    // Every routed page should animate in: either the root or sections use v-reveal.
    if (/[\\/](pages|admin)[\\/]/.test(rel) && !src.includes('v-reveal') && !src.includes('animate-fade-up')) {
        problems++;
        console.log(`${rel} [no entrance motion] add v-reveal.stagger to the root element`);
    }
}
console.log(problems ? `\n${problems} issue(s)` : 'Design system OK');
process.exit(problems ? 1 : 0);
