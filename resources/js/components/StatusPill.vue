<template>
    <span class="text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide whitespace-nowrap" :class="cls">{{ value?.replace(/_/g, ' ') }}</span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({ value: { type: String, default: '' } });

const cls = computed(() => {
    switch (props.value) {
        case 'paid':
        case 'completed':
        case 'ready':
            return 'bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-400';
        case 'confirmed':
        case 'preparing':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-400';
        case 'pending':
            return 'bg-gold-500/15 text-gold-600 dark:text-gold-400';
        case 'failed':
        case 'cancelled':
        case 'expired':
            return 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400';
        default:
            return 'bg-cream-100 text-espresso-700 dark:bg-[#2c2318] dark:text-cream-200';
    }
});
</script>
