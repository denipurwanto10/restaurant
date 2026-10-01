<template>
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <RouterLink to="/menu" class="inline-flex items-center gap-1.5 text-sm font-medium text-espresso-700/70 dark:text-cream-200 hover:text-espresso-900 dark:hover:text-gold-400 transition mb-6">
            <ArrowLeft class="w-4 h-4" /> Back to menu
        </RouterLink>

        <div v-if="loading" class="grid md:grid-cols-2 gap-8">
            <div class="skeleton rounded-3xl aspect-square"></div>
            <div class="space-y-3"><div class="skeleton h-8 rounded w-2/3"></div><div class="skeleton h-4 rounded w-full"></div><div class="skeleton h-4 rounded w-5/6"></div><div class="skeleton h-12 rounded-full w-1/2"></div></div>
        </div>
        <div v-else-if="!menu" class="text-center py-20">
            <p class="font-serif text-2xl font-bold">Menu not found.</p>
            <RouterLink to="/menu" class="text-gold-600 font-semibold dark:text-gold-400">Browse the menu →</RouterLink>
        </div>
        <div v-else class="grid md:grid-cols-2 gap-8 lg:gap-14 animate-fade-up">
            <div class="rounded-[1.75rem] overflow-hidden bg-cream-100 aspect-square shadow-xl relative dark:bg-[#2c2318]">
                <img v-if="menu.image" :src="menu.image" :alt="menu.name" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex flex-col items-center justify-center gap-3 text-espresso-500/40 dark:text-cream-200/70">
                    <UtensilsCrossed class="w-16 h-16" />
                    <span class="font-serif italic text-2xl">{{ menu.name }}</span>
                </div>
                <div class="absolute top-4 left-4 flex gap-1.5">
                    <span v-for="b in menu.badges" :key="b" class="text-xs font-bold px-3 py-1 rounded-full bg-espresso-900 text-gold-400">{{ b }}</span>
                </div>
            </div>

            <div>
                <p class="text-xs font-bold uppercase tracking-[0.2em] text-gold-600 dark:text-gold-400">{{ menu.category?.name }}</p>
                <h1 class="font-serif text-4xl sm:text-5xl font-black mt-1.5">{{ menu.name }}</h1>
                <p class="font-serif text-3xl font-bold text-espresso-800 mt-3 dark:text-cream-100">{{ menu.price_formatted }}</p>
                <p class="text-espresso-700/75 leading-relaxed mt-4 dark:text-cream-200">{{ menu.description }}</p>

                <div v-if="menu.ingredients" class="mt-5 bg-white rounded-2xl border border-cream-200 p-4 dark:bg-[#211a12] dark:border-white/10">
                    <p class="text-xs font-bold uppercase tracking-wider text-espresso-700/60 mb-1.5 dark:text-cream-200">Ingredients</p>
                    <p class="text-sm">{{ menu.ingredients }}</p>
                </div>

                <div v-if="menu.addons?.length" class="mt-4">
                    <p class="font-bold text-[15px] mb-2.5">Add-ons <span class="font-normal text-sm text-espresso-700/60 dark:text-cream-200">(optional)</span></p>
                    <div class="space-y-2">
                        <label
                            v-for="a in menu.addons"
                            :key="a.id"
                            class="flex items-center gap-3 bg-white rounded-xl border px-4 py-3 cursor-pointer transition dark:bg-[#211a12]"
                            :class="selectedAddons.includes(a.id) ? 'border-gold-500 ring-1 ring-gold-500/40' : 'border-cream-200 hover:border-espresso-900/30 dark:border-white/10'"
                        >
                            <input type="checkbox" :value="a.id" v-model="selectedAddons" class="w-5 h-5 accent-[#a67c28]" />
                            <span class="flex-1 text-sm font-medium">{{ a.name }}</span>
                            <span class="text-sm font-bold">+ {{ a.price_formatted }}</span>
                        </label>
                    </div>
                </div>

                <div class="flex items-center gap-4 mt-6">
                    <div class="flex items-center gap-3 bg-white border border-cream-200 rounded-full px-2 py-1.5 dark:bg-[#211a12] dark:border-white/10">
                        <button @click="qty = Math.max(1, qty - 1)" class="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center hover:bg-cream-200 transition dark:bg-[#2c2318] dark:hover:bg-white/10" aria-label="Decrease"><Minus class="w-4 h-4" /></button>
                        <span class="font-bold w-6 text-center">{{ qty }}</span>
                        <button @click="qty = Math.min(50, qty + 1)" class="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center hover:bg-cream-200 transition dark:bg-[#2c2318] dark:hover:bg-white/10" aria-label="Increase"><Plus class="w-4 h-4" /></button>
                    </div>
                    <button
                        @click="addToCart"
                        class="flex-1 inline-flex items-center justify-center gap-2 bg-espresso-900 text-cream-50 font-semibold py-3.5 rounded-full hover:bg-espresso-700 dark:bg-gold-500 dark:text-espresso-900 dark:hover:bg-gold-400 transition active:scale-[0.98]"
                    >
                        <ShoppingBag class="w-5 h-5" /> Add to Cart · {{ formatRupiah((menu.price + addonsTotal) * qty) }}
                    </button>
                </div>

                <textarea
                    v-model="note"
                    rows="2"
                    placeholder="Note for the kitchen (optional)…"
                    class="w-full mt-4 text-sm px-4 py-3 rounded-xl border border-cream-200 bg-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 dark:border-white/10 dark:bg-[#211a12] dark:focus:ring-gold-400/40"
                ></textarea>
            </div>
        </div>

        <!-- Related -->
        <div v-if="related.length" class="mt-16">
            <h2 class="font-serif text-2xl sm:text-3xl font-bold mb-6">You may also like</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <MenuCard v-for="m in related" :key="m.id" :menu="m" @add="quickAdd" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { ArrowLeft, Minus, Plus, ShoppingBag, UtensilsCrossed } from 'lucide-vue-next';
import api from '../services/api';
import MenuCard from '../components/MenuCard.vue';
import { formatRupiah, useCart } from '../stores/cart';
import { useToast } from '../stores/toast';

const route = useRoute();
const cart = useCart();
const { success, error } = useToast();

const menu = ref(null);
const related = ref([]);
const loading = ref(true);
const qty = ref(1);
const selectedAddons = ref([]);
const note = ref('');

const addonsTotal = computed(() =>
    (menu.value?.addons || []).filter((a) => selectedAddons.value.includes(a.id)).reduce((n, a) => n + a.price, 0)
);

function quickAdd(m) {
    cart.addItem(m, 1, []);
    success(`${m.name} added to cart.`);
}

function addToCart() {
    cart.addItem(menu.value, qty.value, [...selectedAddons.value], note.value);
    success(`${qty.value}× ${menu.value.name} added to cart.`);
    qty.value = 1;
    selectedAddons.value = [];
    note.value = '';
}

async function load() {
    loading.value = true;
    try {
        const { data } = await api.get(`/menu/${route.params.slug}`);
        menu.value = data.data;
        document.title = `${menu.value.name} — Saveur Restaurant`;
        const rel = await api.get('/menu', { params: { category: menu.value.category?.slug, per_page: 5 } });
        related.value = rel.data.data.filter((m) => m.id !== menu.value.id).slice(0, 4);
    } catch {
        error('Menu not found.');
    } finally {
        loading.value = false;
    }
}

watch(() => route.params.slug, load);
onMounted(load);
</script>
