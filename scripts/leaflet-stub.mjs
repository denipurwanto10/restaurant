// Smoke-test stub for Leaflet (browser-only map rendering).
const chain = new Proxy(function () {}, {
    get: () => chain,
    apply: () => chain,
});
export default chain;
export const map = () => chain;
export const tileLayer = () => chain;
export const marker = () => chain;
export const icon = () => ({});
