// Node ESM loader that applies public/build/importmap.json (browser parity).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const map = JSON.parse(fs.readFileSync(path.join(root, 'public', 'build', 'importmap.json'), 'utf8')).imports;

export async function resolve(specifier, context, next) {
    // Smoke-only loader: stub Leaflet (needs a real DOM; exercised in browser only).
    if (specifier === 'leaflet') {
        return { url: pathToFileURL(path.join(here, 'leaflet-stub.mjs')).href, shortCircuit: true };
    }
    if (Object.hasOwn(map, specifier)) {
        return { url: pathToFileURL(path.join(root, 'public', map[specifier])).href, shortCircuit: true };
    }
    return next(specifier, context);
}
