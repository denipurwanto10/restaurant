<template>
    <RouterView />
</template>

<script setup>
import { onMounted } from 'vue';
import api from './services/api';
import { useAuth } from './stores/auth';
import { useTheme } from './stores/theme';

const auth = useAuth();

// Apply persisted theme immediately (blade inline script already did pre-paint).
useTheme().init();

onMounted(async () => {
    if (localStorage.getItem('auth_token')) {
        try {
            await auth.fetchMe();
        } catch {
            // stay logged out silently
        }
    }
    // Warm CSRF cookie for Sanctum SPA parity (token-based, harmless)
    try {
        await api.get('/../sanctum/csrf-cookie').catch(() => {});
    } catch { /* ignore */ }
});
</script>
