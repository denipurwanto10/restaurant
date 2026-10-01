import { defineStore } from 'pinia';

let seq = 1;

export const useToast = defineStore('toast', {
    state: () => ({
        toasts: [],
    }),
    actions: {
        push(message, type = 'success') {
            const id = seq++;
            this.toasts.push({ id, message, type });
            setTimeout(() => this.dismiss(id), 3600);
        },
        success(message) {
            this.push(message, 'success');
        },
        error(message) {
            this.push(message, 'error');
        },
        info(message) {
            this.push(message, 'info');
        },
        dismiss(id) {
            this.toasts = this.toasts.filter((t) => t.id !== id);
        },
    },
});
