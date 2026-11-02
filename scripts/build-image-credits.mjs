/**
 * Build docs/menu-image-credits.md from the downloaded image manifest.
 * Usage: node scripts/build-image-credits.mjs
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const API = 'https://commons.wikimedia.org/w/api.php';
const UA = 'SaveurDemoSeeder/1.0 (local development)';
const manifest = JSON.parse(
    await readFile(join(process.cwd(), 'storage', 'app', 'public', 'menu', 'images.json'), 'utf8'),
);

function stripHtml(value = '') {
    return value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

const entries = Object.entries(manifest);
const titles = entries.map(([, image]) => image.title).join('|');

const params = new URLSearchParams({
    action: 'query',
    titles,
    prop: 'imageinfo',
    iiprop: 'extmetadata|url',
    format: 'json',
});

const res = await fetch(`${API}?${params}`, { headers: { 'User-Agent': UA } });
if (!res.ok) throw new Error(`Commons lookup failed: ${res.status}`);
const json = await res.json();

const byTitle = new Map();
for (const page of Object.values(json.query?.pages ?? {})) {
    byTitle.set(page.title, page.imageinfo?.[0]?.extmetadata ?? {});
}

const rows = entries.map(([slug, image]) => {
    const meta = byTitle.get(image.title) ?? {};
    const author = stripHtml(meta.Artist?.value ?? 'Unknown') || 'Unknown';
    const license = stripHtml(meta.LicenseShortName?.value ?? 'See source') || 'See source';
    const source = image.source ?? `https://commons.wikimedia.org/wiki/${encodeURIComponent(image.title)}`;

    return `| ${slug.replace(/-/g, ' ')} | [${image.title.replace(/^File:/, '')}](${source}) | ${author} | ${license} |`;
});

const doc = `# Menu image credits

All product photos in this demo are openly licensed images from
[Wikimedia Commons](https://commons.wikimedia.org/). They were downloaded with
\`node scripts/fetch-menu-images.mjs\` and are served from
\`storage/app/public/menu\`.

If you replace a photo, update this file so attribution stays accurate.

| Menu item | Source file | Author | License |
| --- | --- | --- | --- |
${rows.join('\n')}
`;

await mkdir(join(process.cwd(), 'docs'), { recursive: true });
await writeFile(join(process.cwd(), 'docs', 'menu-image-credits.md'), doc);
console.log(`Wrote docs/menu-image-credits.md with ${rows.length} entries.`);
