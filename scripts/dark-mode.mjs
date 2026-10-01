// Adds `dark:` color variants across Vue templates using a fixed mapping.
// Idempotent: skips tokens that already have a dark: counterpart in the same class attribute.
// Usage: node scripts/dark-mode.mjs [--check]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const jsRoot = path.join(root, 'resources', 'js');
const checkOnly = process.argv.includes('--check');

// Light utility -> dark utility. Only color/surface/border/ring/divide/placeholder.
const MAP = {
    // surfaces
    'bg-white': 'dark:bg-[#211a12]',
    'bg-cream-50': 'dark:bg-[#14100b]',
    'bg-cream-100': 'dark:bg-[#2c2318]',
    'bg-cream-200': 'dark:bg-[#3e3222]',
    'bg-[#f5f1e8]': 'dark:bg-[#14100b]',
    // text
    'text-espresso-900': 'dark:text-cream-100',
    'text-espresso-800': 'dark:text-cream-100',
    'text-espresso-700': 'dark:text-cream-200',
    'text-espresso-600': 'dark:text-gold-400',
    'text-espresso-500': 'dark:text-cream-200',
    // borders
    'border-cream-200': 'dark:border-white/10',
    'border-cream-100': 'dark:border-white/10',
    'divide-cream-200': 'dark:divide-white/10',
    'divide-cream-100': 'dark:divide-white/10',
    // hovers on light surfaces
    'hover:bg-cream-100': 'dark:hover:bg-white/10',
    'hover:bg-cream-200': 'dark:hover:bg-white/10',
    'hover:bg-cream-50': 'dark:hover:bg-white/5',
    'hover:bg-white': 'dark:hover:bg-white/10',
    'hover:border-espresso-900': 'dark:hover:border-gold-400',
    // focus rings on inputs
    'focus:ring-gold-500/50': 'dark:focus:ring-gold-400/40',
    // placeholders
    'placeholder-espresso-700/60': 'dark:placeholder-cream-200/40',
};

function walk(dir, out) {
    out = out || [];
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p, out);
        else if (p.endsWith('.vue')) out.push(p);
    }
    return out;
}

// Match class="..." and :class="'...'" / :class="\"...\"" static string parts.
// We only touch plain class="..." attributes plus ternary string literals inside :class.
function addDarkVariants(src) {
    let changed = 0;
    // 1. class="..."
    src = src.replace(/(\sclass=")([^"]*)(")/g, (m, pre, cls, post) => {
        const out = expandClassList(cls);
        if (out !== cls) changed++;
        return pre + out + post;
    });
    // 2. single-quoted string literals inside :class="..." (ternary branches etc.)
    src = src.replace(/(:class="[^"]*'([^']*)'[^"]*")/g, (m) => {
        return m.replace(/'([^']*)'/g, (sm, cls) => {
            const out = expandClassList(cls);
            if (out !== cls) changed++;
            return "'" + out + "'";
        });
    });
    return { src, changed };
}

function expandClassList(cls) {
    const tokens = cls.split(/\s+/).filter(Boolean);
    const set = new Set(tokens);
    const additions = [];
    for (const t of tokens) {
        // skip tokens with opacity modifiers already handled? keep simple: exact map only
        if (set.has('dark:' + t.replace(/^(hover|focus|active|disabled|sm|md|lg|xl):/, '$1:dark:'))) continue;
        const mapped = MAP[t];
        if (!mapped) continue;
        // don't duplicate if an equivalent dark variant already present
        const darkClass = mapped.replace(/^dark:/, '');
        const has = tokens.some((x) => x === mapped || (x.startsWith('dark:') && x.slice(5) === darkClass));
        if (!has) additions.push(mapped);
    }
    if (!additions.length) return cls;
    return cls + ' ' + additions.join(' ');
}

const files = walk(jsRoot);
let totalChanged = 0;
const changedFiles = [];
for (const f of files) {
    const src = fs.readFileSync(f, 'utf8');
    const { src: out, changed } = addDarkVariants(src);
    if (changed) {
        totalChanged += changed;
        changedFiles.push(path.relative(root, f) + ' (' + changed + ')');
        if (!checkOnly) fs.writeFileSync(f, out);
    }
}
console.log((checkOnly ? '[check] ' : '') + changedFiles.length + ' files, ' + totalChanged + ' class attributes expanded');
for (const c of changedFiles) console.log('  ' + c);
