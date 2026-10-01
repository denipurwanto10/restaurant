<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <div v-for="i in count" :key="i" class="bg-white rounded-2xl overflow-hidden border border-cream-200 dark:bg-[#211a12] dark:border-white/10">
            <div class="skeleton aspect-[4/3]"></div>
            <div class="p-5 space-y-2.5">
                <div class="skeleton h-4 rounded w-2/3"></div>
                <div class="skeleton h-4 rounded w-full"></div>
                <div class="skeleton h-8 rounded-full w-1/2"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({ count: { type: Number, default: 8 } });
</script>
