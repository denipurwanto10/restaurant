<template>
    <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm">
        <TransitionGroup name="toast">
            <div
                v-for="t in toast.toasts"
                :key="t.id"
                class="flex items-start gap-3 rounded-xl px-4 py-3 shadow-lg border text-sm animate-fade-in"
                :class="{
                    'bg-espresso-900 text-cream-50 border-espresso-900 dark:bg-gold-500 dark:text-espresso-900 dark:border-gold-500': t.type === 'success',
                    'bg-red-50 text-red-800 border-red-200 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/30': t.type === 'error',
                    'bg-white text-espresso-800 border-cream-200 dark:bg-[#211a12] dark:text-cream-100 dark:border-white/10': t.type === 'info',
                }"
            >
                <component
                    :is="t.type === 'error' ? CircleAlert : t.type === 'info' ? Info : CircleCheck"
                    class="w-5 h-5 shrink-0 mt-0.5"
                />
                <p class="flex-1">{{ t.message }}</p>
                <button @click="toast.dismiss(t.id)" class="opacity-60 hover:opacity-100 transition">
                    <X class="w-4 h-4" />
                </button>
            </div>
        </TransitionGroup>
    </div>
</template>

<script setup>
import { CircleAlert, CircleCheck, Info, X } from 'lucide-vue-next';
import { useToast } from '../stores/toast';

const toast = useToast();
</script>
