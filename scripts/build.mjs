// Pure-JS production build for the Saveur SPA.
// No bundler, no native binaries: SFCs are compiled to ESM render functions,
// vendor ESM files are copied verbatim, and the browser resolves everything
// through an import map. Usage: node scripts/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { parse, compileScript, compileTemplate } from 'vue/compiler-sfc';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const jsRoot = path.join(root, 'resources', 'js');
const buildRoot = path.join(root, 'public', 'build');
const jsOut = path.join(buildRoot, 'js');
const vendorOut = path.join(buildRoot, 'vendor');

function walk(dir, exts, out) {
    out = out || [];
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p, exts, out);
        else if (exts.some(function (x) { return e.name.endsWith(x); })) out.push(p);
    }
    return out;
}

function toKebab(name) {
    return name
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/([a-zA-Z])(\d)/g, '$1-$2')
        .toLowerCase();
}

// Collect every icon imported from lucide-vue-next across the app
const files = walk(jsRoot, ['.vue', '.js']);
const iconNames = new Set();
const importRe = /import\s*\{([^}]*)\}\s*from\s*['"]lucide-vue-next['"]/g;
for (const f of files) {
    const src = fs.readFileSync(f, 'utf8');
    let m;
    importRe.lastIndex = 0;
    while ((m = importRe.exec(src)) !== null) {
        m[1].split(',').map(function (s) { return s.trim(); }).filter(Boolean).forEach(function (n) {
            iconNames.add(n);
        });
    }
}

const lucideEsm = path.join(root, 'node_modules', 'lucide-vue-next', 'dist', 'esm');
const missingIcons = [];
for (const n of iconNames) {
    if (!fs.existsSync(path.join(lucideEsm, 'icons', toKebab(n) + '.js'))) missingIcons.push(n);
}
if (missingIcons.length) {
    console.error('MISSING LUCIDE ICONS: ' + missingIcons.join(', '));
    process.exit(1);
}
console.log('Icons used: ' + iconNames.size);

// Clean + prepare output dirs
fs.rmSync(buildRoot, { recursive: true, force: true });
fs.mkdirSync(jsOut, { recursive: true });
fs.mkdirSync(vendorOut, { recursive: true });

// Compile SFCs and copy JS, preserving relative structure.
// Compiled SFCs are written with a .js extension; relative imports are
// resolved node-style (.vue -> compiled .js, extensionless, /index).
const outRel = new Map(); // source rel -> output rel
for (const file of files) {
    const rel = path.relative(jsRoot, file);
    // NOTE: '.vue.js' suffix avoids case-insensitive collisions
    // (e.g. App.vue vs app.js) on Windows/macOS filesystems.
    outRel.set(rel, file.endsWith('.vue') ? rel + '.js' : rel);
}

function resolveImport(fromFile, spec) {
    if (!spec.startsWith('.')) return null;
    const base = path.resolve(path.dirname(fromFile), spec);
    const baseRel = path.relative(jsRoot, base);
    const candidates = [baseRel, baseRel + '.vue', baseRel + '.vue.js', baseRel + '.js', path.join(baseRel, 'index.vue'), path.join(baseRel, 'index.js')];
    for (const c of candidates) {
        if (outRel.has(c)) return outRel.get(c);
    }
    return null;
}

let compiled = 0;
for (const file of files) {
    const rel = path.relative(jsRoot, file);
    const out = path.join(jsOut, outRel.get(rel));
    fs.mkdirSync(path.dirname(out), { recursive: true });

    if (file.endsWith('.js')) {
        let jsCode = fs.readFileSync(file, 'utf8');
        jsCode = jsCode.replace(/from\s*(['"])(\.[^'"]*)\1/g, function (m, q, spec) {
            const target = resolveImport(file, spec);
            if (!target) {
                console.error('UNRESOLVED IMPORT in ' + rel + ': ' + spec);
                process.exit(1);
            }
            let relOut = path.relative(path.dirname(out), path.join(jsOut, target));
            if (!relOut.startsWith('.')) relOut = './' + relOut;
            return 'from ' + q + relOut.split(path.sep).join('/') + q;
        });
        jsCode = jsCode.replace(/import\s*\{([^}]*)\}\s*from\s*['"]lucide-vue-next['"]/g, function (m, names) {
            return names.split(',').map(function (s) { return s.trim(); }).filter(Boolean).map(function (n) {
                return "import " + n + " from 'lucide-icon/" + n + "';";
            }).join('\n');
        });
        fs.writeFileSync(out, jsCode);
        continue;
    }

    const src = fs.readFileSync(file, 'utf8');
    const parsed = parse(src, { filename: file });
    if (parsed.errors.length) {
        console.error('SFC parse errors in ' + rel);
        process.exit(1);
    }
    const d = parsed.descriptor;
    const id = crypto.createHash('md5').update(rel).digest('hex').slice(0, 8);
    let code = '';
    let bindings;
    if (d.script || d.scriptSetup) {
        const s = compileScript(d, { id: id, inlineTemplate: false });
        bindings = s.bindings;
        // Capture the default export so we can attach render() to it.
        code += s.content.replace(/export\s+default\b/, 'const __sfc__ =');
    } else {
        code += 'const __sfc__ = {};\n';
    }
    if (d.template) {
        const t = compileTemplate({
            source: d.template.content,
            filename: file,
            id: id,
            compilerOptions: { bindingMetadata: bindings },
        });
        if (t.errors.length) {
            console.error('Template errors in ' + rel + ': ' + JSON.stringify(t.errors.slice(0, 2)));
            process.exit(1);
        }
        code += '\n' + t.code + '\n__sfc__.render = render;\n';
    }
    code += '\n__sfc__.__file = ' + JSON.stringify(rel) + ';\nexport default __sfc__;\n';

    // Rewrite lucide barrel imports into per-icon deep imports via import map keys
    code = code.replace(/import\s*\{([^}]*)\}\s*from\s*['"]lucide-vue-next['"]/g, function (m, names) {
        return names.split(',').map(function (s) { return s.trim(); }).filter(Boolean).map(function (n) {
            return "import " + n + " from 'lucide-icon/" + n + "';";
        }).join('\n');
    });

    // Rewrite relative imports to compiled .js output paths
    code = code.replace(/from\s*(['"])(\.[^'"]*)\1/g, function (m, q, spec) {
        const target = resolveImport(file, spec);
        if (!target) {
            console.error('UNRESOLVED IMPORT in ' + rel + ': ' + spec);
            process.exit(1);
        }
        let relOut = path.relative(path.dirname(out), path.join(jsOut, target));
        if (!relOut.startsWith('.')) relOut = './' + relOut;
        return 'from ' + q + relOut.split(path.sep).join('/') + q;
    });

    fs.writeFileSync(out, code);
    compiled++;
}
console.log('Compiled ' + compiled + ' modules');

// Vendor: single-file ESM builds + used lucide icons
function copyFile(src, dest) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
}
const nm = path.join(root, 'node_modules');
copyFile(path.join(nm, 'vue', 'dist', 'vue.runtime.esm-browser.prod.js'), path.join(vendorOut, 'vue.js'));
copyFile(path.join(nm, 'vue-router', 'dist', 'vue-router.esm-browser.prod.js'), path.join(vendorOut, 'vue-router.js'));
copyFile(path.join(nm, 'pinia', 'dist', 'pinia.esm-browser.prod.js'), path.join(vendorOut, 'pinia.js'));
copyFile(path.join(nm, 'axios', 'dist', 'esm', 'axios.js'), path.join(vendorOut, 'axios.js'));
copyFile(path.join(nm, 'leaflet', 'dist', 'leaflet-src.esm.js'), path.join(vendorOut, 'leaflet.js'));
// lucide shared modules (keep relative layout under vendor/lucide/)
for (const n of iconNames) {
    copyFile(path.join(lucideEsm, 'icons', toKebab(n) + '.js'), path.join(vendorOut, 'lucide', 'icons', toKebab(n) + '.js'));
}
copyFile(path.join(lucideEsm, 'createLucideIcon.js'), path.join(vendorOut, 'lucide', 'createLucideIcon.js'));
copyFile(path.join(lucideEsm, 'Icon.js'), path.join(vendorOut, 'lucide', 'Icon.js'));
copyFile(path.join(lucideEsm, 'defaultAttributes.js'), path.join(vendorOut, 'lucide', 'defaultAttributes.js'));
(function copyShared(dir) {
    const srcDir = path.join(lucideEsm, dir);
    if (!fs.existsSync(srcDir)) return;
    for (const e of fs.readdirSync(srcDir, { withFileTypes: true })) {
        const s = path.join(srcDir, e.name);
        const d = path.join(vendorOut, 'lucide', dir, e.name);
        if (e.isDirectory()) copyShared(path.join(dir, e.name));
        else copyFile(s, d);
    }
})('shared');

// Verify no remaining bare imports except mapped ones (line-anchored)
const allowedBare = new Set(['vue', 'vue-router', 'pinia', 'axios', 'leaflet']);
const bareRe = /^import\s[^;]*?\sfrom\s*['"]([^'"]+)['"]/gm;
const problems = [];
for (const f of walk(jsOut, ['.js'])) {
    const src = fs.readFileSync(f, 'utf8');
    let m;
    bareRe.lastIndex = 0;
    while ((m = bareRe.exec(src)) !== null) {
        if (!allowedBare.has(m[1]) && !m[1].startsWith('lucide-icon/') && !m[1].startsWith('.')) problems.push(path.relative(jsOut, f) + ' -> ' + m[1]);
    }
}
for (const f of walk(path.join(vendorOut, 'lucide'), ['.js'])) {
    const src = fs.readFileSync(f, 'utf8');
    let m;
    bareRe.lastIndex = 0;
    while ((m = bareRe.exec(src)) !== null) {
        if (m[1].startsWith('.')) continue; // relative: browser resolves natively
        if (!allowedBare.has(m[1])) problems.push('vendor/' + path.relative(vendorOut, f) + ' -> ' + m[1]);
    }
}
if (problems.length) {
    console.error('UNMAPPED BARE IMPORTS:\n' + problems.join('\n'));
    process.exit(1);
}

// Import map
const importMap = { imports: { vue: '/build/vendor/vue.js', 'vue-router': '/build/vendor/vue-router.js', pinia: '/build/vendor/pinia.js', axios: '/build/vendor/axios.js', leaflet: '/build/vendor/leaflet.js' } };
for (const n of iconNames) {
    importMap.imports['lucide-icon/' + n] = '/build/vendor/lucide/icons/' + toKebab(n) + '.js';
}
fs.writeFileSync(path.join(buildRoot, 'importmap.json'), JSON.stringify(importMap, null, 2));

// CSS via Tailwind v3 (pure JS)
console.log('Compiling CSS...');
const cssSrc = fs.readFileSync(path.join(root, 'resources', 'css', 'app.css'), 'utf8');
const cssOutDir = path.join(buildRoot, 'assets');
fs.mkdirSync(cssOutDir, { recursive: true });
const css = await postcss([tailwindcss(path.join(root, 'tailwind.config.js')), autoprefixer]).process(cssSrc, { from: path.join(root, 'resources', 'css', 'app.css') });
fs.writeFileSync(path.join(cssOutDir, 'app.css'), css.css);
// Leaflet css + marker images (same relative layout as dist)
const leafDir = path.join(buildRoot, 'assets', 'leaflet');
fs.mkdirSync(leafDir, { recursive: true });
fs.copyFileSync(path.join(nm, 'leaflet', 'dist', 'leaflet.css'), path.join(leafDir, 'leaflet.css'));
const imgSrc = path.join(nm, 'leaflet', 'dist', 'images');
if (fs.existsSync(imgSrc)) {
    fs.mkdirSync(path.join(leafDir, 'images'), { recursive: true });
    for (const img of fs.readdirSync(imgSrc)) fs.copyFileSync(path.join(imgSrc, img), path.join(leafDir, 'images', img));
}

console.log('BUILD OK: ' + compiled + ' modules, ' + iconNames.size + ' icons');
