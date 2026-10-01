// Verify every module reachable from the entry exists on disk,
// simulating browser ESM resolution (relative + import map).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const buildRoot = path.join(root, 'public', 'build');
const importMap = JSON.parse(fs.readFileSync(path.join(buildRoot, 'importmap.json'), 'utf8')).imports;

const visited = new Set();
const missing = [];
const importRe = /^[ \t]*import\s[^;\n]*?\sfrom\s*['"]([^'"]+)['"]/gm;
const exportRe = /^[ \t]*export\s[^;\n]*?\sfrom\s*['"]([^'"]+)['"]/gm;

function resolve(spec, fromFile) {
    if (importMap[spec]) return path.join(root, 'public', importMap[spec]);
    if (spec.startsWith('.')) {
        let p = path.resolve(path.dirname(fromFile), spec);
        if (fs.existsSync(p) && fs.statSync(p).isFile()) return p;
        return null;
    }
    return 'BARE:' + spec;
}

function visit(file) {
    const key = path.normalize(file);
    if (visited.has(key)) return;
    visited.add(key);
    if (!fs.existsSync(key)) {
        missing.push(key);
        return;
    }
    const src = fs.readFileSync(key, 'utf8');
    for (const re of [importRe, exportRe]) {
        re.lastIndex = 0;
        let m;
        while ((m = re.exec(src)) !== null) {
            const r = resolve(m[1], key);
            if (r === null) missing.push(key + ' :: UNRESOLVED ' + m[1]);
            else if (r.startsWith('BARE:')) missing.push(key + ' :: BARE ' + m[1]);
            else visit(r);
        }
    }
}

visit(path.join(buildRoot, 'js', 'app.js'));

console.log('Visited ' + visited.size + ' modules');
for (const v of visited) console.log('  ' + path.relative(buildRoot, v));
if (missing.length) {
    console.log('PROBLEMS:\n' + missing.join('\n'));
    process.exit(1);
}
console.log('ALL MODULES RESOLVE OK');
