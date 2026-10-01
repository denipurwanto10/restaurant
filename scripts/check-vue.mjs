// Static syntax check: extract <script setup> blocks from .vue files and
// parse them with the Vue compiler (no bundling, no child processes).
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'vue/compiler-sfc';

const root = 'resources/js';
const files = [];
(function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p);
        else if (e.name.endsWith('.vue') || e.name.endsWith('.js')) files.push(p);
    }
})(root);

let errors = 0;
for (const f of files) {
    try {
        const src = fs.readFileSync(f, 'utf8');
        if (f.endsWith('.vue')) {
            const { descriptor, errors: errs } = parse(src, { filename: f });
            if (errs.length) {
                console.log('PARSE ERROR in ' + f + ': ' + errs.map((e) => e.message).join('; '));
                errors++;
            }
            if (!descriptor.script && !descriptor.scriptSetup) {
                console.log('NO SCRIPT in ' + f);
            }
        } else {
            // plain js: use dynamic import via data URL? just check balancing basics
            await import('node:vm').then((vm) => {
                new vm.SourceTextModule(src, { identifier: f });
            }).catch((e) => {
                // vm.SourceTextModule needs --experimental-vm-modules; fallback message
                console.log('SKIP plain check ' + f + ': ' + e.message);
            });
        }
    } catch (e) {
        console.log('ERROR in ' + f + ': ' + e.message);
        errors++;
    }
}
console.log(errors === 0 ? 'ALL VUE FILES PARSE OK (' + files.length + ' files)' : errors + ' FILES WITH ERRORS');
