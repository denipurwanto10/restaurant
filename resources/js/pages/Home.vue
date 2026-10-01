<template>
    <div>
        <!-- HERO -->
        <section class="relative overflow-hidden">
            <div class="pointer-events-none absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-gold-500/10 blur-3xl dark:bg-gold-500/10"></div>
            <div class="pointer-events-none absolute top-64 -left-40 w-[380px] h-[380px] rounded-full bg-espresso-900/5 blur-3xl dark:bg-gold-400/5"></div>
            <div class="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-16 sm:pt-20 sm:pb-24 grid lg:grid-cols-2 gap-10 items-center relative">
                <div class="animate-fade-up">
                    <p class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gold-600 bg-gold-500/10 border border-gold-500/25 px-4 py-1.5 rounded-full dark:text-gold-400">
                        <Sparkles class="w-3.5 h-3.5" /> Fine Dining · Est. 2012
                    </p>
                    <h1 class="font-serif text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.02] mt-5">
                        Crafted with Passion, <span class="italic text-espresso-600 dark:text-gold-400">Served</span> with Soul.
                    </h1>
                    <p class="text-espresso-700/75 dark:text-cream-200 text-base sm:text-lg mt-5 max-w-md leading-relaxed">
                        From wood-fired mains to slow-brewed coffee — every plate at Saveur tells a story of fire, flavor, and care.
                    </p>
                    <div class="flex flex-wrap gap-3 mt-8">
                        <RouterLink to="/menu" class="inline-flex items-center gap-2 bg-espresso-900 text-cream-50 font-semibold px-7 py-3.5 rounded-full hover:bg-espresso-700 dark:bg-gold-500 dark:text-espresso-900 dark:hover:bg-gold-400 hover:shadow-xl transition active:scale-95">
                            Order Now <ArrowRight class="w-4 h-4" />
                        </RouterLink>
                        <RouterLink to="/branches" class="inline-flex items-center gap-2 font-semibold px-7 py-3.5 rounded-full border-2 border-espresso-900/15 dark:border-white/20 hover:border-espresso-900 dark:hover:border-gold-400 hover:bg-white dark:hover:bg-white/10 transition active:scale-95">
                            <MapPin class="w-4 h-4" /> Find Branches
                        </RouterLink>
                    </div>
                    <div class="flex flex-wrap items-center gap-x-6 gap-y-3 mt-9 text-sm">
                        <div><p class="font-serif text-2xl font-bold">24+</p><p class="text-espresso-700/60 dark:text-cream-200">Signature dishes</p></div>
                        <div class="w-px h-10 bg-espresso-900/10"></div>
                        <div><p class="font-serif text-2xl font-bold">3</p><p class="text-espresso-700/60 dark:text-cream-200">City branches</p></div>
                        <div class="w-px h-10 bg-espresso-900/10"></div>
                        <div><p class="font-serif text-2xl font-bold">4.9</p><p class="text-espresso-700/60 dark:text-cream-200">Guest rating</p></div>
                    </div>
                </div>
                <div class="relative animate-fade-in">
                    <div class="rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/5] max-h-[560px] w-full bg-espresso-800 relative">
                        <img src="https://images.unsplash.com/photo-1544025162-d76694265947?w=900&q=80" alt="Signature wagyu steak" class="w-full h-full object-cover" />
                        <div class="absolute inset-0 bg-gradient-to-t from-espresso-900/60 via-transparent to-transparent"></div>
                        <div class="absolute bottom-5 left-5 right-5 bg-cream-50/95 dark:bg-[#211a12]/95 backdrop-blur rounded-2xl p-4 flex items-center gap-4 border border-white/40 dark:border-white/10 shadow-lg">
                            <img src="https://images.unsplash.com/photo-1600891964092-4316c288032e?w=200&q=60" alt="Chef special" class="w-14 h-14 rounded-xl object-cover" />
                            <div class="flex-1">
                                <p class="text-xs font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400">Chef's Special</p>
                                <p class="font-serif font-bold">Wagyu Steak · Rp 185.000</p>
                            </div>
                            <button @click="orderChefSpecial" class="w-10 h-10 rounded-full bg-espresso-900 text-cream-50 flex items-center justify-center hover:bg-gold-500 hover:text-espresso-900 dark:hover:bg-gold-400 transition" aria-label="Quick add">
                                <Plus class="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <div class="absolute -top-4 -right-2 sm:-right-4 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2.5 rotate-3 dark:bg-[#211a12]">
                        <span class="w-9 h-9 rounded-full bg-green-100 dark:bg-green-500/15 flex items-center justify-center"><Star class="w-4 h-4 text-green-700 dark:text-green-400" /></span>
                        <div class="text-xs"><p class="font-bold text-sm">4.9 / 5.0</p><p class="text-espresso-700/60 dark:text-cream-200">2.400+ reviews</p></div>
                    </div>
                </div>
            </div>
        </section>

        <!-- PROMO BANNER -->
        <section v-if="promos.length" class="max-w-7xl mx-auto px-4 sm:px-6">
            <div class="bg-espresso-900 text-cream-50 rounded-3xl px-6 sm:px-10 py-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 relative overflow-hidden">
                <BadgePercent class="absolute -right-6 -bottom-8 w-44 h-44 text-white/5" />
                <div class="flex-1">
                    <p class="text-gold-400 text-xs font-bold uppercase tracking-[0.2em]">Limited Offer</p>
                    <h2 class="font-serif text-2xl sm:text-3xl font-bold mt-1">{{ promos[0].title }}</h2>
                    <p class="text-cream-200/70 text-sm mt-1">{{ promos[0].description }}</p>
                </div>
                <div class="flex items-center gap-2 bg-white/10 border border-dashed border-gold-400/60 rounded-xl px-4 py-2.5 font-mono font-bold tracking-widest">
                    {{ promos[0].code }}
                    <button @click="copyPromo(promos[0].code)" class="ml-1 p-1.5 rounded-lg hover:bg-white/10 transition" aria-label="Copy code">
                        <Copy class="w-4 h-4" />
                    </button>
                </div>
            </div>
        </section>

        <!-- FEATURED MENU -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 mt-16 sm:mt-24">
            <div class="flex items-end justify-between mb-7">
                <div>
                    <p class="text-xs font-bold uppercase tracking-[0.2em] text-gold-600 dark:text-gold-400">Curated For You</p>
                    <h2 class="font-serif text-3xl sm:text-4xl font-bold mt-1.5">Featured Dishes</h2>
                </div>
                <RouterLink to="/menu" class="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold hover:text-gold-600 transition dark:text-gold-400">View all <ArrowRight class="w-4 h-4" /></RouterLink>
            </div>
            <MenuSkeleton v-if="loadingFeatured" :count="4" />
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <MenuCard v-for="m in featured" :key="m.id" :menu="m" @add="quickAdd" />
            </div>
        </section>

        <!-- STORY -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 mt-16 sm:mt-24 grid lg:grid-cols-2 gap-10 items-center">
            <div class="rounded-[2rem] overflow-hidden shadow-xl aspect-[4/3] bg-cream-100 dark:bg-[#2c2318]">
                <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80" alt="Saveur dining room" loading="lazy" class="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div>
                <p class="text-xs font-bold uppercase tracking-[0.2em] text-gold-600 dark:text-gold-400">Our Story</p>
                <h2 class="font-serif text-3xl sm:text-4xl font-bold mt-1.5 leading-tight">A table where Jakarta slows down.</h2>
                <p class="text-espresso-700/75 mt-4 leading-relaxed dark:text-cream-200">Since 2012, Saveur has blended European technique with Indonesian soul. Our chefs source daily from local farms, age our steaks in-house, and roast single-origin coffee every morning.</p>
                <div class="grid grid-cols-2 gap-4 mt-7">
                    <div v-for="f in whyUs" :key="f.title" class="bg-white rounded-2xl border border-cream-200 p-4 dark:bg-[#211a12] dark:border-white/10">
                        <component :is="f.icon" class="w-6 h-6 text-gold-600 dark:text-gold-400" />
                        <p class="font-bold mt-2.5 text-[15px]">{{ f.title }}</p>
                        <p class="text-sm text-espresso-700/65 dark:text-cream-200 mt-1">{{ f.desc }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- POPULAR -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 mt-16 sm:mt-24">
            <div class="flex items-end justify-between mb-7">
                <div>
                    <p class="text-xs font-bold uppercase tracking-[0.2em] text-gold-600 dark:text-gold-400">Guest Favorites</p>
                    <h2 class="font-serif text-3xl sm:text-4xl font-bold mt-1.5">Popular Right Now</h2>
                </div>
            </div>
            <MenuSkeleton v-if="loadingFeatured" :count="4" />
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <MenuCard v-for="m in popular" :key="m.id" :menu="m" @add="quickAdd" />
            </div>
        </section>

        <!-- BRANCHES -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 mt-16 sm:mt-24">
            <div class="flex items-end justify-between mb-7">
                <div>
                    <p class="text-xs font-bold uppercase tracking-[0.2em] text-gold-600 dark:text-gold-400">Visit Us</p>
                    <h2 class="font-serif text-3xl sm:text-4xl font-bold mt-1.5">Three Doors, One Soul</h2>
                </div>
                <RouterLink to="/branches" class="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold hover:text-gold-600 transition dark:text-gold-400">View map <ArrowRight class="w-4 h-4" /></RouterLink>
            </div>
            <div class="grid sm:grid-cols-3 gap-5">
                <RouterLink
                    v-for="b in branches"
                    :key="b.id"
                    :to="`/branches/${b.slug}`"
                    class="group bg-white rounded-2xl border border-cream-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 dark:bg-[#211a12] dark:border-white/10"
                >
                    <div class="h-44 bg-espresso-800 relative overflow-hidden">
                        <img :src="branchImage(b.slug)" :alt="b.name" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <span class="absolute bottom-3 left-3 text-[11px] font-bold bg-cream-50/95 px-3 py-1 rounded-full">{{ b.city }}</span>
                    </div>
                    <div class="p-5">
                        <h3 class="font-serif text-xl font-bold">{{ b.name }}</h3>
                        <p class="text-sm text-espresso-700/65 dark:text-cream-200 mt-1 line-clamp-1">{{ b.address }}</p>
                        <p class="text-sm text-espresso-700/65 dark:text-cream-200 mt-1.5 flex items-center gap-1.5"><Clock class="w-3.5 h-3.5" /> {{ b.opening_hours }}</p>
                    </div>
                </RouterLink>
            </div>
        </section>

        <!-- TESTIMONIALS -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 mt-16 sm:mt-24">
            <p class="text-xs font-bold uppercase tracking-[0.2em] text-gold-600 text-center dark:text-gold-400">Word of Mouth</p>
            <h2 class="font-serif text-3xl sm:text-4xl font-bold mt-1.5 text-center">Loved by Our Guests</h2>
            <div class="grid sm:grid-cols-3 gap-5 mt-8">
                <figure v-for="r in reviews" :key="r.id" class="bg-white rounded-2xl border border-cream-200 p-6 flex flex-col dark:bg-[#211a12] dark:border-white/10">
                    <div class="flex gap-0.5 text-gold-500">
                        <Star v-for="i in 5" :key="i" class="w-4 h-4" :class="i <= r.rating ? 'fill-current' : 'opacity-30'" />
                    </div>
                    <blockquote class="text-[15px] text-espresso-800/85 dark:text-cream-100 mt-3.5 flex-1 leading-relaxed">“{{ r.comment }}”</blockquote>
                    <figcaption class="mt-4 pt-4 border-t border-cream-200 flex items-center gap-3 dark:border-white/10">
                        <span class="w-10 h-10 rounded-full bg-espresso-800 text-cream-50 flex items-center justify-center font-bold">{{ r.customer_name.charAt(0) }}</span>
                        <div><p class="font-semibold text-sm">{{ r.customer_name }}</p><p class="text-xs text-espresso-700/60 dark:text-cream-200">{{ r.branch?.name ?? 'Verified guest' }}</p></div>
                    </figcaption>
                </figure>
            </div>
        </section>

        <!-- HOURS / CTA -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 mt-16 sm:mt-24">
            <div class="rounded-[2rem] overflow-hidden relative bg-espresso-900 text-cream-50">
                <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&q=70" alt="Restaurant interior" loading="lazy" class="absolute inset-0 w-full h-full object-cover opacity-25" />
                <div class="relative px-6 sm:px-14 py-14 sm:py-20 text-center max-w-2xl mx-auto">
                    <Clock class="w-10 h-10 mx-auto text-gold-400" />
                    <h2 class="font-serif text-3xl sm:text-5xl font-bold mt-4">Hungry? Your table is waiting.</h2>
                    <p class="text-cream-200/75 mt-3">Open daily · Mon–Fri 10:00–22:00 · Sat–Sun 09:00–23:00</p>
                    <div class="flex flex-wrap justify-center gap-3 mt-8">
                        <RouterLink to="/menu" class="inline-flex items-center gap-2 bg-gold-500 text-espresso-900 font-bold px-8 py-3.5 rounded-full hover:bg-gold-400 transition active:scale-95">Order Now <ArrowRight class="w-4 h-4" /></RouterLink>
                        <RouterLink to="/menu" class="inline-flex items-center gap-2 font-semibold px-8 py-3.5 rounded-full border border-cream-50/30 hover:bg-white/10 transition">Explore Menu</RouterLink>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { ArrowRight, BadgePercent, Clock, Copy, Leaf, MapPin, Plus, Sparkles, Star, UtensilsCrossed, Wheat } from 'lucide-vue-next';
import api from '../services/api';
import MenuCard from '../components/MenuCard.vue';
import MenuSkeleton from '../components/MenuSkeleton.vue';
import { formatRupiah, useCart } from '../stores/cart';
import { useToast } from '../stores/toast';

const cart = useCart();
const { success, error, info } = useToast();

const featured = ref([]);
const popular = ref([]);
const branches = ref([]);
const promos = ref([]);
const reviews = ref([]);
const loadingFeatured = ref(true);

const whyUs = [
    { icon: UtensilsCrossed, title: 'Chef-crafted', desc: 'Recipes refined over 12 years of fire and flavor.' },
    { icon: Leaf, title: 'Farm fresh', desc: 'Produce sourced daily from local Indonesian farms.' },
    { icon: Wheat, title: 'Baked in-house', desc: 'Breads, desserts and pizza dough made from scratch.' },
    { icon: Star, title: 'Rated 4.9', desc: 'Loved by 2.400+ verified guests across Jakarta.' },
];

function branchImage(slug) {
    return {
        downtown: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=60',
        central: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&q=60',
        'mall-galeria': 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=60',
    }[slug] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=60';
}

function quickAdd(menu) {
    cart.addItem(menu, 1, []);
    success(`${menu.name} added to cart.`);
}

async function orderChefSpecial() {
    try {
        const { data } = await api.get('/menu/featured');
        const dish = (data.data || []).find((m) => m.is_available) ?? data.data?.[0];
        if (!dish) {
            error('Chef special unavailable right now.');
            return;
        }
        cart.addItem(dish, 1, []);
        success(`${dish.name} added to cart.`);
    } catch {
        error('Could not add item. Please try again.');
    }
}

function copyPromo(code) {
    navigator.clipboard?.writeText(code);
    info(`Promo code ${code} copied.`);
}

onMounted(async () => {
    try {
        const [feat, br, pr, rev] = await Promise.all([
            api.get('/menu/featured'),
            api.get('/branches'),
            api.get('/promos'),
            api.get('/reviews'),
        ]);
        const all = feat.data.data;
        featured.value = all.filter((m) => m.is_featured).slice(0, 4);
        if (!featured.value.length) featured.value = all.slice(0, 4);
        popular.value = [...all].sort((a, b) => b.sold_count - a.sold_count).slice(0, 4);
        branches.value = br.data.data;
        promos.value = pr.data.data;
        reviews.value = rev.data.data;
        document.title = 'Saveur — Crafted with Passion, Served with Soul';
    } catch {
        error('Failed to load homepage data.');
    } finally {
        loadingFeatured.value = false;
    }
});
</script>
