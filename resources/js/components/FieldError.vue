<template>
    <div class="max-w-2xl mx-auto">
        <p v-if="errors[field]" class="text-xs text-red-600 mt-1 dark:text-red-400">{{ errors[field][0] }}</p>
    </div>
</template>

<script setup>
defineProps({ errors: { type: Object, default: () => ({}) }, field: { type: String, required: true } });
</script>
