<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-gold-600 dark:text-gold-400">Our Menu</p>
        <h1 class="font-serif text-4xl sm:text-5xl font-bold mt-1">Taste the Craft</h1>

        <!-- Toolbar -->
        <div class="mt-7 bg-white rounded-2xl border border-cream-200 p-4 space-y-3.5 dark:bg-[#211a12] dark:border-white/10">
            <div class="flex flex-col md:flex-row gap-3">
                <div class="relative flex-1">
                    <Search class="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-500/50 dark:text-cream-200/70" />
                    <input
                        v-model="filters.search"
                        type="text"
                        placeholder="Search dishes… (e.g. steak, pasta, coffee)"
                        class="w-full pl-11 pr-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-gold-500/50 text-sm dark:border-white/10 dark:bg-[#14100b] dark:focus:ring-gold-400/40"
                    />
                </div>
                <select v-model="filters.sort" class="px-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold-500/50 dark:border-white/10 dark:bg-[#14100b] dark:focus:ring-gold-400/40">
                    <option value="popular">Most popular</option>
                    <option value="price_asc">Price: low to high</option>
                    <option value="price_desc">Price: high to low</option>
                    <option value="newest">Newest</option>
                </select>
            </div>
            <div class="flex flex-wrap gap-2">
                <button
                    @click="filters.category = ''"
                    class="px-4 py-1.5 rounded-full text-sm font-semibold transition"
                    :class="!filters.category ? 'bg-espresso-900 text-cream-50 dark:bg-gold-500 dark:text-espresso-900' : 'bg-cream-100 hover:bg-cream-200 dark:bg-[#2c2318] dark:hover:bg-white/10'"
                >All</button>
                <button
                    v-for="c in categories"
                    :key="c.id"
                    @click="filters.category = c.slug"
                    class="px-4 py-1.5 rounded-full text-sm font-semibold transition"
                    :class="filters.category === c.slug ? 'bg-espresso-900 text-cream-50 dark:bg-gold-500 dark:text-espresso-900' : 'bg-cream-100 hover:bg-cream-200 dark:bg-[#2c2318] dark:hover:bg-white/10'"
                >{{ c.name }}</button>
            </div>
            <div class="flex flex-wrap gap-2 text-[13px]">
                <button @click="filters.vegetarian = !filters.vegetarian" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition" :class="filters.vegetarian ? 'border-green-600 bg-green-50 text-green-800 dark:border-green-500/40 dark:bg-green-500/15 dark:text-green-400 font-semibold' : 'border-cream-200 text-espresso-700/70 dark:border-white/10 dark:text-cream-200'">
                    <Leaf class="w-3.5 h-3.5" /> Vegetarian
                </button>
                <button @click="filters.spicy = !filters.spicy" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition" :class="filters.spicy ? 'border-red-600 bg-red-50 text-red-700 dark:border-red-500/40 dark:bg-red-500/15 dark:text-red-400 font-semibold' : 'border-cream-200 text-espresso-700/70 dark:border-white/10 dark:text-cream-200'">
                    <Flame class="w-3.5 h-3.5" /> Spicy
                </button>
                <button @click="filters.featured = !filters.featured" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition" :class="filters.featured ? 'border-gold-600 bg-gold-500/10 text-gold-600 dark:text-gold-400 font-semibold' : 'border-cream-200 text-espresso-700/70 dark:border-white/10 dark:text-cream-200'">
                    <Star class="w-3.5 h-3.5" /> Featured
                </button>
            </div>
        </div>

        <!-- Results -->
        <p class="text-sm text-espresso-700/60 mt-6 mb-4 dark:text-cream-200">{{ meta.total ?? 0 }} dishes found</p>
        <MenuSkeleton v-if="loading" :count="8" />
        <div v-else-if="!menus.length" class="text-center py-20 bg-white rounded-3xl border border-cream-200 dark:bg-[#211a12] dark:border-white/10">
            <UtensilsCrossed class="w-12 h-12 mx-auto text-espresso-500/30 dark:text-cream-200/70" />
            <p class="font-serif text-2xl font-bold mt-4">No menu found.</p>
            <p class="text-sm text-espresso-700/60 mt-1 dark:text-cream-200">Try a different search or filter.</p>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <MenuCard v-for="m in menus" :key="m.id" :menu="m" @add="quickAdd" />
        </div>

        <!-- Pagination -->
        <div v-if="meta.last_page > 1" class="flex justify-center items-center gap-2 mt-10">
            <button
                v-for="p in meta.last_page"
                :key="p"
                @click="goPage(p)"
                class="w-10 h-10 rounded-full text-sm font-bold transition"
                :class="meta.current_page === p ? 'bg-espresso-900 text-cream-50 dark:bg-gold-500 dark:text-espresso-900' : 'bg-white border border-cream-200 hover:border-espresso-900 dark:bg-[#211a12] dark:border-white/10 dark:hover:border-gold-400'"
            >{{ p }}</button>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Flame, Leaf, Search, Star, UtensilsCrossed } from 'lucide-vue-next';
import api from '../services/api';
import MenuCard from '../components/MenuCard.vue';
import MenuSkeleton from '../components/MenuSkeleton.vue';
import { useCart } from '../stores/cart';
import { useToast } from '../stores/toast';

const route = useRoute();
const router = useRouter();
const cart = useCart();
const { success, error } = useToast();

const menus = ref([]);
const categories = ref([]);
const meta = ref({});
const loading = ref(true);
const filters = reactive({
    search: route.query.search || '',
    category: route.query.category || '',
    sort: 'popular',
    vegetarian: false,
    spicy: false,
    featured: false,
    page: 1,
});

let debounce;
watch(filters, () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
        filters.page = 1;
        fetchMenus();
        router.replace({ query: { ...route.query, search: filters.search || undefined, category: filters.category || undefined } });
    }, 350);
}, { deep: true });

function quickAdd(menu) {
    cart.addItem(menu, 1, []);
    success(`${menu.name} added to cart.`);
}

function goPage(p) {
    filters.page = p;
    fetchMenus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function fetchMenus() {
    loading.value = true;
    try {
        const params = {
            per_page: 12,
            page: filters.page,
            sort: filters.sort,
            search: filters.search || undefined,
            category: filters.category || undefined,
            vegetarian: filters.vegetarian ? 1 : undefined,
            spicy: filters.spicy ? 1 : undefined,
            featured: filters.featured ? 1 : undefined,
        };
        const { data } = await api.get('/menu', { params });
        menus.value = data.data;
        meta.value = data.meta;
    } catch {
        error('Failed to load menu.');
    } finally {
        loading.value = false;
    }
}

onMounted(async () => {
    document.title = 'Menu — Saveur Restaurant';
    try {
        const { data } = await api.get('/categories');
        categories.value = data.data;
    } catch { /* ignore */ }
    await fetchMenus();
});
</script>
