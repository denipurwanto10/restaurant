// Batch 3: remaining buttons + selected order-type chip.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');

const FIXES = [
    { file: 'resources/js/admin/CategoryManagement.vue', from: 'class="flex-1 py-3 rounded-full bg-espresso-900 text-cream-50 font-semibold text-sm disabled:opacity-50"', to: 'class="flex-1 py-3 rounded-full bg-espresso-900 dark:bg-gold-500 text-cream-50 dark:text-espresso-900 font-semibold text-sm disabled:opacity-50"' },
    { file: 'resources/js/admin/ManageResources.vue', from: 'class="flex-1 py-3 rounded-full bg-espresso-900 text-cream-50 font-semibold text-sm disabled:opacity-50">{{ saving ? \'Saving…\' : \'Save\' }}</button>', to: 'class="flex-1 py-3 rounded-full bg-espresso-900 dark:bg-gold-500 text-cream-50 dark:text-espresso-900 font-semibold text-sm disabled:opacity-50">{{ saving ? \'Saving…\' : \'Save\' }}</button>' },
    { file: 'resources/js/admin/ManageResources.vue', from: 'class="flex-1 py-3 rounded-full bg-espresso-900 text-cream-50 font-semibold text-sm disabled:opacity-50">{{ saving ? \'Saving…\' : \'Save\' }}</button>', to: 'class="flex-1 py-3 rounded-full bg-espresso-900 dark:bg-gold-500 text-cream-50 dark:text-espresso-900 font-semibold text-sm disabled:opacity-50">{{ saving ? \'Saving…\' : \'Save\' }}</button>' },
    { file: 'resources/js/pages/Checkout.vue', from: 'class="inline-block mt-3 font-semibold bg-espresso-900 text-cream-50 px-6 py-2.5 rounded-full">Explore our menu', to: 'class="inline-block mt-3 font-semibold bg-espresso-900 dark:bg-gold-500 text-cream-50 dark:text-espresso-900 px-6 py-2.5 rounded-full">Explore our menu' },
    { file: 'resources/js/pages/Checkout.vue', from: "'border-espresso-900 bg-espresso-900 text-cream-50'", to: "'border-espresso-900 dark:border-gold-500 bg-espresso-900 dark:bg-gold-500 text-cream-50 dark:text-espresso-900'" },
    { file: 'resources/js/pages/Orders.vue', from: 'class="inline-block mt-3 font-semibold bg-espresso-900 text-cream-50 px-6 py-2.5 rounded-full">Login', to: 'class="inline-block mt-3 font-semibold bg-espresso-900 dark:bg-gold-500 text-cream-50 dark:text-espresso-900 px-6 py-2.5 rounded-full">Login' },
    { file: 'resources/js/pages/Orders.vue', from: 'class="inline-block mt-3 font-semibold bg-espresso-900 text-cream-50 px-6 py-2.5 rounded-full">Order Now', to: 'class="inline-block mt-3 font-semibold bg-espresso-900 dark:bg-gold-500 text-cream-50 dark:text-espresso-900 px-6 py-2.5 rounded-full">Order Now' },
];

let n = 0;
for (const j of FIXES) {
    const f = path.join(root, j.file);
    const src = fs.readFileSync(f, 'utf8');
    if (!src.includes(j.from)) {
        console.log('SKIP: ' + j.file + ' :: ' + j.from.slice(0, 60));
        continue;
    }
    fs.writeFileSync(f, src.replace(j.from, j.to));
    n++;
}
console.log('batch3 applied: ' + n + '/' + FIXES.length);
