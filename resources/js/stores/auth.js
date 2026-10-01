import { defineStore } from 'pinia';
import api, { setAuthToken } from '../services/api';

export const useAuth = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('auth_user') || 'null'),
        loading: false,
    }),
    actions: {
        persist(u, token) {
            this.user = u;
            if (u) localStorage.setItem('auth_user', JSON.stringify(u));
            else localStorage.removeItem('auth_user');
            setAuthToken(token ?? localStorage.getItem('auth_token'));
        },
        async fetchMe() {
            try {
                const { data } = await api.get('/me');
                this.persist(data.user, localStorage.getItem('auth_token'));
                return data.user;
            } catch {
                this.persist(null, null);
                return null;
            }
        },
        async login(email, password) {
            this.loading = true;
            try {
                const { data } = await api.post('/login', { email, password });
                this.persist(data.user, data.token);
                return data;
            } finally {
                this.loading = false;
            }
        },
        async register(payload) {
            this.loading = true;
            try {
                const { data } = await api.post('/register', payload);
                this.persist(data.user, data.token);
                return data;
            } finally {
                this.loading = false;
            }
        },
        async logout() {
            try {
                await api.post('/logout');
            } catch { /* ignore */ }
            this.persist(null, null);
        },
    },
});
