<template>
    <button
        @click="theme.toggle()"
        class="p-2.5 rounded-full transition"
        :class="onDarkSurface
            ? 'hover:bg-white/10 text-cream-100'
            : 'hover:bg-cream-100 dark:hover:bg-white/10 text-espresso-800 dark:text-gold-400'"
        :aria-label="theme.mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
        :title="theme.mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
    >
        <Sun v-if="theme.mode === 'dark'" class="w-5 h-5" />
        <Moon v-else class="w-5 h-5" />
    </button>
</template>

<script setup>
import { Moon, Sun } from 'lucide-vue-next';
import { useTheme } from '../stores/theme';

defineProps({ onDarkSurface: { type: Boolean, default: false } });

const theme = useTheme();
</script>
