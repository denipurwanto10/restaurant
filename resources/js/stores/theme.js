import { defineStore } from 'pinia';
import { ref } from 'vue';

const STORAGE_KEY = 'saveur_theme';

function systemPrefersDark() {
    return typeof window !== 'undefined'
        && typeof window.matchMedia === 'function'
        && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export const useTheme = defineStore('theme', () => {
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    const mode = ref(stored === 'dark' || stored === 'light' ? stored : (systemPrefersDark() ? 'dark' : 'light'));

    function apply() {
        if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', mode.value === 'dark');
            document.documentElement.style.colorScheme = mode.value;
        }
        try {
            localStorage.setItem(STORAGE_KEY, mode.value);
        } catch { /* ignore */ }
    }

    function toggle() {
        mode.value = mode.value === 'dark' ? 'light' : 'dark';
        apply();
    }

    function init() {
        apply();
    }

    return { mode, toggle, init };
});
