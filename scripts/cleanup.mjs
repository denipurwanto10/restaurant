// Cleanup pass: remove invalid/duplicate Tailwind classes and small polish fixes.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');

const jobs = [
    {
        file: 'resources/js/pages/Checkout.vue',
        from: '<QrCode v-if="m.type === \'qris\'" class="w-4.5 h-4.5 w-5 h-5" />',
        to: '<QrCode v-if="m.type === \'qris\'" class="w-5 h-5" />',
    },
    {
        file: 'resources/js/pages/Menu.vue',
        from: '<Search class="w-4.5 h-4.5 w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-500/50" />',
        to: '<Search class="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-500/50" />',
    },
    {
        file: 'resources/js/pages/MenuDetail.vue',
        from: 'class="mt-5 bg-white rounded-2xl border border-cream-200 p-4.5 p-4 dark:bg-[#211a12] dark:border-white/10"',
        to: 'class="mt-5 bg-white rounded-2xl border border-cream-200 p-4 dark:bg-[#211a12] dark:border-white/10"',
    },
    {
        file: 'resources/js/pages/MenuDetail.vue',
        from: '<input type="checkbox" :value="a.id" v-model="selectedAddons" class="w-4.5 h-4.5 w-5 h-5 accent-[#a67c28]" />',
        to: '<input type="checkbox" :value="a.id" v-model="selectedAddons" class="w-5 h-5 accent-[#a67c28]" />',
    },
    {
        file: 'resources/js/pages/MenuDetail.vue',
        from: '<ShoppingBag class="w-4.5 h-4.5 w-5 h-5" /> Add to Cart',
        to: '<ShoppingBag class="w-5 h-5" /> Add to Cart',
    },
    {
        file: 'resources/js/pages/Home.vue',
        from: 'class="bg-white rounded-2xl border border-cream-200 p-4.5 p-4 dark:bg-[#211a12] dark:border-white/10"',
        to: 'class="bg-white rounded-2xl border border-cream-200 p-4 dark:bg-[#211a12] dark:border-white/10"',
    },
    {
        file: 'resources/js/components/MenuCard.vue',
        from: 'class="text-sm text-espresso-700/70 line-clamp-2 mt-1 min-h-10 dark:text-cream-200"',
        to: 'class="text-sm text-espresso-700/70 line-clamp-2 mt-1 min-h-[2.5rem] dark:text-cream-200"',
    },
    {
        file: 'resources/js/components/Navbar.vue',
        from: 'class="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-gold-500 text-white text-xs font-bold flex items-center justify-center"',
        to: 'class="absolute -top-0.5 -right-0.5 min-w-[1.25rem] h-5 px-1 rounded-full bg-gold-500 text-white text-xs font-bold flex items-center justify-center"',
    },
    {
        file: 'resources/js/layouts/AdminLayout.vue',
        from: '<header class="sticky top-0 z-20 bg-[#f5f1e8]/90 backdrop-blur border-b border-cream-200 h-16 flex items-center gap-3 px-4 sm:px-8 dark:border-white/10">',
        to: '<header class="sticky top-0 z-20 bg-[#f5f1e8]/90 dark:bg-[#14100b]/90 backdrop-blur border-b border-cream-200 h-16 flex items-center gap-3 px-4 sm:px-8 dark:border-white/10">',
    },
    {
        file: 'resources/js/pages/Checkout.vue',
        from: "    return errors.value[field] ? 'border-red-400' : 'border-cream-200';",
        to: "    return errors.value[field] ? 'border-red-400' : 'border-cream-200 dark:border-white/10';",
    },
];

let ok = 0;
for (const j of jobs) {
    const f = path.join(root, j.file);
    const src = fs.readFileSync(f, 'utf8');
    if (!src.includes(j.from)) {
        console.log('SKIP (not found): ' + j.file + ' :: ' + j.from.slice(0, 60));
        continue;
    }
    fs.writeFileSync(f, src.replace(j.from, j.to));
    ok++;
}
console.log('cleanup applied: ' + ok + '/' + jobs.length);
