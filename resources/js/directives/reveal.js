// v-reveal          → element rises + fades in once when it enters the viewport
// v-reveal.stagger  → its direct children rise one after another (used on page roots)
const index = (el) => [...el.children].forEach((c, i) => c.style.setProperty('--i', Math.min(i, 9)));

export default {
    mounted(el, { modifiers }) {
        el.classList.add('reveal');
        if (modifiers.stagger) { el.classList.add('reveal-stagger'); index(el); }
        const show = () => { el.classList.add('is-in'); el._io?.disconnect(); };
        if (!('IntersectionObserver' in window)) return show();
        el._io = new IntersectionObserver(([e]) => e.isIntersecting && show(), { threshold: 0, rootMargin: '0px 0px -8% 0px' });
        el._io.observe(el);
        if (modifiers.stagger) el._t = setTimeout(show, 700); // page roots are always visible: never leave them hidden
    },
    updated(el, { modifiers }) { if (modifiers.stagger) index(el); },
    unmounted(el) { el._io?.disconnect(); clearTimeout(el._t); },
};
