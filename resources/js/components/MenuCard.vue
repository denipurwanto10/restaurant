<template>
    <div class="bg-white rounded-2xl overflow-hidden border border-cream-200 shadow-[0_2px_16px_rgba(62,50,34,0.06)] hover:shadow-[0_8px_32px_rgba(62,50,34,0.12)] hover:-translate-y-1 transition-all duration-300 group dark:bg-[#211a12] dark:border-white/10">
        <RouterLink :to="`/menu/${menu.slug}`" class="block relative aspect-[4/3] overflow-hidden bg-cream-100 dark:bg-[#2c2318]">
            <img
                v-if="menu.image"
                :src="menu.image"
                :alt="menu.name"
                loading="lazy"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div v-else class="w-full h-full flex flex-col items-center justify-center gap-2 text-espresso-500/50 dark:text-cream-200/70">
                <UtensilsCrossed class="w-10 h-10" />
                <span class="font-serif italic text-lg">{{ menu.name }}</span>
            </div>
            <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span
                    v-for="b in (menu.badges || []).slice(0, 2)"
                    :key="b"
                    class="text-[11px] font-bold px-2.5 py-1 rounded-full"
                    :class="badgeClass(b)"
                >{{ b }}</span>
            </div>
            <span v-if="menu.is_spicy" class="absolute top-3 right-3 w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center" title="Spicy">
                <Flame class="w-4 h-4" />
            </span>
            <span v-if="menu.is_vegetarian" class="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-green-700 text-white flex items-center justify-center" title="Vegetarian">
                <Leaf class="w-4 h-4" />
            </span>
        </RouterLink>
        <div class="p-4 sm:p-5">
            <p class="text-[11px] font-semibold uppercase tracking-wider text-gold-600 mb-1 dark:text-gold-400">{{ menu.category?.name }}</p>
            <RouterLink :to="`/menu/${menu.slug}`" class="font-serif text-lg font-bold text-espresso-900 hover:text-espresso-600 transition line-clamp-1 dark:text-cream-100 dark:hover:text-gold-400">
                {{ menu.name }}
            </RouterLink>
            <p class="text-sm text-espresso-700/70 line-clamp-2 mt-1 min-h-[2.5rem] dark:text-cream-200">{{ menu.description }}</p>
            <div class="flex items-center justify-between mt-3.5">
                <span class="font-bold text-espresso-900 dark:text-cream-100">{{ menu.price_formatted }}</span>
                <button
                    @click="$emit('add', menu)"
                    class="inline-flex items-center gap-1.5 text-sm font-semibold bg-espresso-900 text-cream-50 pl-3 pr-4 py-2 rounded-full hover:bg-espresso-700 dark:bg-gold-500 dark:text-espresso-900 dark:hover:bg-gold-400 active:scale-95 transition"
                >
                    <Plus class="w-4 h-4" /> Add
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Flame, Leaf, Plus, UtensilsCrossed } from 'lucide-vue-next';

defineProps({ menu: { type: Object, required: true } });
defineEmits(['add']);

function badgeClass(b) {
    if (b === 'Popular' || b === 'Best Seller') return 'bg-espresso-900 text-gold-400';
    if (b === 'New') return 'bg-green-700 text-white';
    if (b === 'Spicy') return 'bg-red-600 text-white';
    if (b === 'Vegetarian') return 'bg-green-100 text-green-800 border border-green-300 dark:bg-green-500/15 dark:text-green-400 dark:border-green-500/30';
    return 'bg-gold-500 text-espresso-900';
}
</script>
