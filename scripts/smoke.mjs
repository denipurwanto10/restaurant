// Runtime smoke test: import the whole app module graph in Node with a
// minimal browser stub, boot pinia + router (memory history), resolve every
// route and touch every store. No DOM mount. Usage:
//   node --loader ./scripts/smoke-loader.mjs scripts/smoke.mjs
const store = {};
globalThis.localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
};
function setGlobal(key, value) {
    try {
        globalThis[key] = value;
    } catch {
        try {
            Object.defineProperty(globalThis, key, { value: value, configurable: true, writable: true });
        } catch { /* ignore */ }
    }
}
setGlobal('window', globalThis);
setGlobal('document', {
    title: '',
    documentElement: { style: {} },
    querySelector: () => null,
    createElement: () => ({ setAttribute() {}, appendChild() {}, style: {}, getElementsByTagName: () => [] }),
    getElementsByTagName: () => [],
    head: { appendChild() {} },
    body: { appendChild() {}, style: {} },
});
setGlobal('location', { pathname: '/', search: '', hash: '' });
setGlobal('navigator', { userAgent: 'node-smoke' });
setGlobal('history', { state: null, pushState() {}, replaceState() {}, go() {} });
setGlobal('addEventListener', () => {});
setGlobal('removeEventListener', () => {});
setGlobal('requestAnimationFrame', (fn) => setTimeout(fn, 0));

const { createPinia, setActivePinia } = await import('pinia');
const pinia = createPinia();
setActivePinia(pinia);

const router = (await import('../public/build/js/router/index.js')).default;
const routes = router.getRoutes().map((r) => r.path);
console.log('Routes registered: ' + routes.length);

// Resolve every route (lazy components execute their module top-level code)
for (const r of router.getRoutes()) {
    const record = r;
    const comps = Object.values(record.components || {});
    for (const c of comps) {
        if (typeof c === 'function') await c();
    }
}
console.log('All route components loaded OK');

// Touch every store + component module
const { useCart, formatRupiah } = await import('../public/build/js/stores/cart.js');
const { useAuth } = await import('../public/build/js/stores/auth.js');
const { useToast } = await import('../public/build/js/stores/toast.js');
const cart = useCart();
cart.addItem({ id: 1, name: 'Smoke Test', price: 50000, slug: 'smoke', image: null }, 2);
console.log('Cart count: ' + cart.count + ' subtotal: ' + cart.subtotal + ' formatted: ' + formatRupiah(cart.subtotal));
const auth = useAuth();
console.log('Auth store user: ' + JSON.stringify(auth.user));
const toast = useToast();
toast.success('smoke');
console.log('Toasts: ' + toast.toasts.length);

// Import every remaining compiled module to execute top-level code
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const jsRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'build', 'js');
function walk(dir, out) {
    out = out || [];
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p, out);
        else if (p.endsWith('.js')) out.push(p);
    }
    return out;
}
let n = 0;
for (const f of walk(jsRoot)) {
    await import(pathToFileURL(f).href);
    n++;
}
console.log('SMOKE OK: imported ' + n + ' app modules with zero top-level errors');
