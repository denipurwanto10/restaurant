<template>
    <article class="group menu-card">
        <RouterLink :to="`/menu/${menu.slug}`" class="block relative aspect-[4/5] sm:aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-cream-100 dark:bg-[#261d15]">
            <img
                v-if="menu.image"
                :src="menu.image"
                :alt="menu.name"
                loading="lazy"
                class="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.05]"
            />
            <div v-else class="w-full h-full flex flex-col items-center justify-center gap-2 text-espresso-500/60 dark:text-cream-200/60">
                <UtensilsCrossed class="w-8 h-8" stroke-width="1.25" />
                <span class="font-serif italic text-xl px-4 text-center">{{ menu.name }}</span>
            </div>
            <div class="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span
                    v-for="b in (menu.badges || []).slice(0, 2)"
                    :key="b"
                    class="text-[10px] font-medium uppercase tracking-[0.12em] px-2.5 py-1 rounded-full backdrop-blur-md"
                    :class="badgeClass(b)"
                >{{ b }}</span>
            </div>
            <div class="absolute bottom-3 right-3 flex gap-1.5">
                <span v-if="menu.is_spicy" class="w-7 h-7 rounded-full bg-cream-50/90 text-red-700 flex items-center justify-center backdrop-blur" title="Spicy"><Flame class="w-3.5 h-3.5" /></span>
                <span v-if="menu.is_vegetarian" class="w-7 h-7 rounded-full bg-cream-50/90 text-green-800 flex items-center justify-center backdrop-blur" title="Vegetarian"><Leaf class="w-3.5 h-3.5" /></span>
            </div>
        </RouterLink>

        <div class="pt-4 px-1">
            <div class="flex items-baseline justify-between gap-3">
                <RouterLink :to="`/menu/${menu.slug}`" class="font-serif text-[1.4rem] leading-tight text-espresso-900 dark:text-cream-100 line-clamp-1 hover:text-gold-600 dark:hover:text-gold-400">
                    {{ menu.name }}
                </RouterLink>
                <span class="text-sm font-medium tabular-nums text-espresso-900 dark:text-cream-100 whitespace-nowrap">{{ menu.price_formatted }}</span>
            </div>
            <p class="text-[11px] uppercase tracking-[0.16em] text-gold-600 dark:text-gold-400 mt-1">{{ menu.category?.name }}</p>
            <p class="text-sm text-espresso-600 dark:text-cream-200/80 line-clamp-2 mt-2 min-h-[2.5rem] leading-relaxed">{{ menu.description }}</p>
            <button
                @click="$emit('add', menu)"
                class="mt-3 w-full inline-flex items-center justify-center gap-1.5 text-[13px] font-medium py-2.5 rounded-full border border-espresso-900/15 dark:border-white/15 text-espresso-900 dark:text-cream-100 hover:bg-espresso-900 hover:text-cream-50 hover:border-espresso-900 dark:hover:bg-gold-500 dark:hover:text-espresso-900 dark:hover:border-gold-500"
            >
                <Plus class="w-3.5 h-3.5" /> Add to cart
            </button>
        </div>
    </article>
</template>

<script setup>
import { Flame, Leaf, Plus, UtensilsCrossed } from 'lucide-vue-next';

defineProps({ menu: { type: Object, required: true } });
defineEmits(['add']);

function badgeClass(b) {
    if (b === 'Popular' || b === 'Best Seller') return 'bg-espresso-900/80 text-gold-400';
    if (b === 'New') return 'bg-cream-50/90 text-espresso-900';
    if (b === 'Spicy') return 'bg-red-700/85 text-white';
    if (b === 'Vegetarian') return 'bg-green-800/85 text-white';
    return 'bg-gold-500/90 text-espresso-900';
}
</script>
