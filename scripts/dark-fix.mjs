// Second dark-mode pass: fix unreadable text, wrong variants, selected states,
// red/green pills, and hover directions. Idempotent. Usage: node scripts/dark-fix.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');

// Exact string replacements (from -> to). Keep in sync with audit findings.
const FIXES = [
    // ---- wrong cream-on-gold overrides: drop the dark:text ----
    { file: 'resources/js/layouts/AdminLayout.vue', from: 'bg-gold-500 text-espresso-900 flex items-center justify-center font-serif text-xl font-bold dark:text-cream-100', to: 'bg-gold-500 text-espresso-900 flex items-center justify-center font-serif text-xl font-bold' },
    { file: 'resources/js/layouts/AdminLayout.vue', from: "'bg-gold-500 text-espresso-900 font-semibold dark:text-cream-100'", to: "'bg-gold-500 text-espresso-900 font-semibold'" },
    { file: 'resources/js/components/Footer.vue', from: 'bg-gold-500 text-espresso-900 flex items-center justify-center font-serif text-xl font-bold dark:text-cream-100', to: 'bg-gold-500 text-espresso-900 flex items-center justify-center font-serif text-xl font-bold' },
    { file: 'resources/js/pages/BranchDetail.vue', from: 'dark:text-cream-100', to: 'dark:text-espresso-900', count: 1 },

    // ---- navbar: dark header bg + dark-aware active links ----
    { file: 'resources/js/components/Navbar.vue', from: 'bg-cream-50/90 backdrop-blur border-b border-cream-200 dark:border-white/10', to: 'bg-cream-50/90 dark:bg-[#14100b]/90 backdrop-blur border-b border-cream-200 dark:border-white/10' },
    { file: 'resources/js/components/Navbar.vue', from: 'active-class="text-espresso-900 font-semibold"', to: 'active-class="text-espresso-900 dark:text-gold-400 font-semibold"', all: true },
    { file: 'resources/js/components/Navbar.vue', from: 'text-red-700">Logout', to: 'text-red-700 dark:text-red-400">Logout' },
    { file: 'resources/js/components/Navbar.vue', from: 'class="block px-3 py-2.5 rounded-lg bg-espresso-900 text-cream-50 text-center font-semibold"', to: 'class="block px-3 py-2.5 rounded-lg bg-espresso-900 dark:bg-gold-500 text-cream-50 dark:text-espresso-900 text-center font-semibold"' },
    { file: 'resources/js/components/Navbar.vue', from: 'bg-gold-500 text-white text-xs', to: 'bg-gold-500 text-espresso-900 text-xs' },

    // ---- unreadable muted text: add dark:text-cream-200 ----
    { file: 'resources/js/components/CartDrawer.vue', from: 'text-sm text-espresso-700/70">Explore our menu', to: 'text-sm text-espresso-700/70 dark:text-cream-200">Explore our menu' },
    { file: 'resources/js/components/CartDrawer.vue', from: 'text-xs text-espresso-700/60 truncate">+', to: 'text-xs text-espresso-700/60 dark:text-cream-200 truncate">+' },
    { file: 'resources/js/pages/Home.vue', from: 'text-espresso-700/75 text-base sm:text-lg mt-5 max-w-md leading-relaxed', to: 'text-espresso-700/75 dark:text-cream-200 text-base sm:text-lg mt-5 max-w-md leading-relaxed' },
    { file: 'resources/js/pages/Home.vue', from: '<p class="text-espresso-700/60">Signature dishes</p>', to: '<p class="text-espresso-700/60 dark:text-cream-200">Signature dishes</p>' },
    { file: 'resources/js/pages/Home.vue', from: '<p class="text-espresso-700/60">City branches</p>', to: '<p class="text-espresso-700/60 dark:text-cream-200">City branches</p>' },
    { file: 'resources/js/pages/Home.vue', from: '<p class="text-espresso-700/60">Guest rating</p>', to: '<p class="text-espresso-700/60 dark:text-cream-200">Guest rating</p>' },
    { file: 'resources/js/pages/Home.vue', from: '<p class="text-sm text-espresso-700/65 mt-1">{{ f.desc }}</p>', to: '<p class="text-sm text-espresso-700/65 dark:text-cream-200 mt-1">{{ f.desc }}</p>' },
    { file: 'resources/js/pages/Home.vue', from: '<p class="text-sm text-espresso-700/65 mt-1 line-clamp-1">{{ b.address }}</p>', to: '<p class="text-sm text-espresso-700/65 dark:text-cream-200 mt-1 line-clamp-1">{{ b.address }}</p>' },
    { file: 'resources/js/pages/Home.vue', from: '<p class="text-sm text-espresso-700/65 mt-1.5 flex items-center gap-1.5"><Clock', to: '<p class="text-sm text-espresso-700/65 dark:text-cream-200 mt-1.5 flex items-center gap-1.5"><Clock' },
    { file: 'resources/js/pages/Home.vue', from: '<blockquote class="text-[15px] text-espresso-800/85 mt-3.5 flex-1 leading-relaxed">', to: '<blockquote class="text-[15px] text-espresso-800/85 dark:text-cream-100 mt-3.5 flex-1 leading-relaxed">' },
    { file: 'resources/js/pages/Home.vue', from: '<p class="text-xs text-espresso-700/60">{{ r.branch?.name', to: '<p class="text-xs text-espresso-700/60 dark:text-cream-200">{{ r.branch?.name' },

    // ---- back links (4 pages) ----
    { file: 'resources/js/pages/MenuDetail.vue', from: 'text-espresso-700/70 hover:text-espresso-900 transition mb-6', to: 'text-espresso-700/70 dark:text-cream-200 hover:text-espresso-900 dark:hover:text-gold-400 transition mb-6' },
    { file: 'resources/js/pages/OrderDetail.vue', from: 'text-espresso-700/70 hover:text-espresso-900 transition mb-6', to: 'text-espresso-700/70 dark:text-cream-200 hover:text-espresso-900 dark:hover:text-gold-400 transition mb-6' },
    { file: 'resources/js/pages/BranchDetail.vue', from: 'text-espresso-700/70 hover:text-espresso-900 transition mb-6', to: 'text-espresso-700/70 dark:text-cream-200 hover:text-espresso-900 dark:hover:text-gold-400 transition mb-6' },
];

let applied = 0;
let skipped = [];
for (const j of FIXES) {
    const f = path.join(root, j.file);
    let src = fs.readFileSync(f, 'utf8');
    const occurrences = src.split(j.from).length - 1;
    if (occurrences === 0) {
        skipped.push(j.file + ' :: ' + j.from.slice(0, 70));
        continue;
    }
    if (j.all) {
        src = src.split(j.from).join(j.to);
        applied += occurrences;
    } else {
        src = src.replace(j.from, j.to);
        applied += 1;
    }
    fs.writeFileSync(f, src);
}
console.log('dark-fix applied: ' + applied);
if (skipped.length) {
    console.log('SKIPPED (' + skipped.length + '):');
    for (const s of skipped) console.log('  ' + s);
}
