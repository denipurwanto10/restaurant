/**
 * Fetch openly-licensed food photos from Wikimedia Commons and store them
 * for every seeded menu item. Images are saved to storage/app/public/menu
 * so the existing Menu::getImageUrlAttribute() / storage:link setup serves them.
 *
 * Usage: node scripts/fetch-menu-images.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const API = 'https://commons.wikimedia.org/w/api.php';
const UA = 'SaveurDemoSeeder/1.0 (local development; contact: dev@example.test)';
const OUT_DIR = join(process.cwd(), 'storage', 'app', 'public', 'menu');
const MAP_FILE = join(process.cwd(), 'storage', 'app', 'public', 'menu', 'images.json');

const dishes = [
    { slug: 'bruschetta-al-pomodoro', q: 'bruschetta tomato', must: ['bruschetta'], title: 'File:Bruschetta 001.jpg' },
    { slug: 'caesar-salad', q: 'caesar salad', must: ['caesar', 'salad'] },
    { slug: 'crispy-calamari', q: 'fried calamari squid', must: ['calamari', 'squid'] },
    { slug: 'french-fries-truffle', q: 'french fries truffle', must: ['fries', 'truffle'] },
    { slug: 'wagyu-steak', q: 'wagyu steak', must: ['wagyu', 'steak'], title: 'File:Steak at restaurant Vltava.jpg' },
    { slug: 'chicken-steak', q: 'grilled chicken steak', must: ['chicken', 'steak'], title: 'File:Pesto Chicken and Grilled Zucchini.jpg' },
    { slug: 'truffle-pasta', q: 'truffle pasta tagliatelle', must: ['truffle', 'pasta', 'tagliatelle'] },
    { slug: 'beef-burger-deluxe', q: 'cheeseburger', must: ['burger', 'cheeseburger'] },
    { slug: 'margherita-pizza', q: 'margherita pizza', must: ['pizza', 'margherita'] },
    { slug: 'salmon-teriyaki', q: 'salmon teriyaki', must: ['salmon', 'teriyaki'] },
    { slug: 'nasi-goreng-special', q: 'nasi goreng', must: ['nasi', 'goreng', 'fried rice'] },
    { slug: 'beef-rendang', q: 'beef rendang', must: ['rendang'], title: 'File:Rendang daging sapi asli Padang.JPG' },
    { slug: 'spaghetti-aglio-e-olio', q: 'spaghetti aglio e olio', must: ['spaghetti', 'aglio', 'olio'] },
    { slug: 'tiramisu-classico', q: 'tiramisu dessert', must: ['tiramisu'], title: 'File:Tiramisu dessert.jpg' },
    { slug: 'new-york-cheesecake', q: 'new york cheesecake', must: ['cheesecake'] },
    { slug: 'chocolate-lava-cake', q: 'chocolate lava cake fondant', must: ['lava', 'fondant', 'chocolate cake'] },
    { slug: 'panna-cotta-berry', q: 'panna cotta berries', must: ['panna', 'cotta'] },
    { slug: 'iced-tea-classic', q: 'iced tea glass', must: ['iced tea', 'ice tea'] },
    { slug: 'lemon-tea-honey', q: 'lemon tea', must: ['lemon', 'tea'], title: 'File:Iced Tea.jpg' },
    { slug: 'mango-smoothie', q: 'mango smoothie', must: ['mango', 'smoothie'] },
    { slug: 'espresso', q: 'espresso cup', must: ['espresso'], title: 'File:Espresso shot close-up.jpg' },
    { slug: 'cappuccino', q: 'cappuccino', must: ['cappuccino'] },
    { slug: 'caffe-latte', q: 'cafe latte', must: ['latte'], title: 'File:Closeup of a cup of latte art with coffee powder.jpg' },
    { slug: 'caramel-macchiato', q: 'caramel macchiato', must: ['macchiato', 'caramel'], title: 'File:2023-09-27 Latte Macchiato.jpg' },
];

const BAD_WORDS = [
    'logo', 'sign', 'map', 'diagram', 'drawing', 'illustration', 'painting',
    'menu board', 'packet', 'package', 'label', 'poster', 'stamp', 'coin',
    'restaurant exterior', 'storefront', 'shop front', 'advertisement',
];

function scoreCandidate(page, must) {
    const info = page.imageinfo?.[0];
    if (!info) return -100;

    const title = page.title.toLowerCase();
    const mime = info.mime ?? '';
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(mime)) return -100;

    const width = info.thumbwidth ?? info.width ?? 0;
    const height = info.thumbheight ?? info.height ?? 0;
    if (width < 700 || height < 450) return -100;

    let score = 0;
    for (const word of BAD_WORDS) {
        if (title.includes(word)) score -= 6;
    }
    for (const word of must) {
        if (title.includes(word)) score += 3;
    }
    const ratio = width / height;
    if (ratio >= 1.2 && ratio <= 1.9) score += 2;
    if (ratio < 1) score -= 3;
    if (width >= 1000) score += 1;

    return score;
}

async function search(query) {
    const params = new URLSearchParams({
        action: 'query',
        generator: 'search',
        gsrsearch: `filetype:bitmap ${query}`,
        gsrnamespace: '6',
        gsrlimit: '12',
        prop: 'imageinfo',
        iiprop: 'url|mime|size',
        iiurlwidth: '1200',
        format: 'json',
    });

    const res = await fetch(`${API}?${params}`, { headers: { 'User-Agent': UA } });
    if (!res.ok) throw new Error(`Commons search failed: ${res.status}`);
    const json = await res.json();
    return Object.values(json.query?.pages ?? {});
}

async function byTitle(title) {
    const params = new URLSearchParams({
        action: 'query',
        titles: title,
        prop: 'imageinfo',
        iiprop: 'url|mime|size',
        iiurlwidth: '1200',
        format: 'json',
    });

    const res = await fetch(`${API}?${params}`, { headers: { 'User-Agent': UA } });
    if (!res.ok) throw new Error(`Commons lookup failed: ${res.status}`);
    const json = await res.json();
    return Object.values(json.query?.pages ?? {});
}

async function download(url, file) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) throw new Error(`download failed: ${res.status}`);
    const type = res.headers.get('content-type') ?? '';
    if (!type.startsWith('image/')) throw new Error(`unexpected content-type: ${type}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    await writeFile(file, buffer);
    return buffer.length;
}

await mkdir(OUT_DIR, { recursive: true });

const manifest = {};
let failures = 0;

for (const dish of dishes) {
    try {
        const pages = dish.title ? await byTitle(dish.title) : await search(dish.q);
        const ranked = pages
            .map((page) => ({ page, score: scoreCandidate(page, dish.must) }))
            .filter((item) => item.score > -100)
            .sort((a, b) => b.score - a.score);

        if (!ranked.length) throw new Error('no usable candidate');

        const { page, score } = ranked[0];
        const info = page.imageinfo[0];
        const url = info.thumburl ?? info.url;
        const ext = (() => {
            const raw = extname(new URL(info.url).pathname).toLowerCase();
            return raw === '.jpeg' ? '.jpg' : raw || '.jpg';
        })();
        const file = join(OUT_DIR, `${dish.slug}${ext}`);
        const bytes = await download(url, file);

        manifest[dish.slug] = {
            file: `menu/${dish.slug}${ext}`,
            source: info.descriptionurl ?? info.url,
            title: page.title,
            score,
            bytes,
        };
        console.log(`OK  ${dish.slug} (${Math.round(bytes / 1024)} KB, score ${score}) ${page.title}`);
    } catch (err) {
        failures++;
        console.error(`ERR ${dish.slug}: ${err.message}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
}

await writeFile(MAP_FILE, JSON.stringify(manifest, null, 2));
console.log(`\nSaved ${Object.keys(manifest).length}/${dishes.length} images. Manifest: ${MAP_FILE}`);
if (failures) process.exitCode = 1;
