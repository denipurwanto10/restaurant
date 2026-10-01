<template>
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <RouterLink to="/branches" class="inline-flex items-center gap-1.5 text-sm font-medium text-espresso-700/70 dark:text-cream-200 hover:text-espresso-900 dark:hover:text-gold-400 transition mb-6">
            <ArrowLeft class="w-4 h-4" /> All branches
        </RouterLink>

        <div v-if="loading" class="space-y-3">
            <div class="skeleton h-72 rounded-3xl"></div>
            <div class="skeleton h-8 rounded w-1/2"></div>
        </div>

        <template v-else-if="branch">
            <div class="rounded-[2rem] overflow-hidden relative h-64 sm:h-96 bg-espresso-800">
                <img :src="heroImage" :alt="branch.name" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-t from-espresso-900/85 via-espresso-900/20 to-transparent"></div>
                <div class="absolute bottom-0 p-6 sm:p-10 text-cream-50">
                    <p class="text-gold-400 text-xs font-bold uppercase tracking-[0.2em]">{{ branch.city }}</p>
                    <h1 class="font-serif text-4xl sm:text-6xl font-black mt-1">{{ branch.name }}</h1>
                </div>
            </div>

            <div class="grid lg:grid-cols-[1fr_360px] gap-6 mt-8 items-start">
                <div class="space-y-5">
                    <div class="bg-white rounded-2xl border border-cream-200 p-5 sm:p-6 dark:bg-[#211a12] dark:border-white/10">
                        <h2 class="font-serif text-xl font-bold">About this branch</h2>
                        <p class="text-espresso-700/75 mt-2 leading-relaxed dark:text-cream-200">{{ branch.description }}</p>
                        <div class="grid sm:grid-cols-2 gap-3.5 mt-5 text-sm">
                            <p class="flex items-start gap-2"><MapPin class="w-4 h-4 mt-0.5 text-gold-600 shrink-0 dark:text-gold-400" /> {{ branch.address }}, {{ branch.city }}</p>
                            <p class="flex items-center gap-2"><Phone class="w-4 h-4 text-gold-600 shrink-0 dark:text-gold-400" /> {{ branch.phone }}</p>
                            <p class="flex items-center gap-2"><Clock class="w-4 h-4 text-gold-600 shrink-0 dark:text-gold-400" /> {{ branch.opening_hours }}</p>
                        </div>
                    </div>

                    <div v-if="branch.facilities" class="bg-white rounded-2xl border border-cream-200 p-5 sm:p-6 dark:bg-[#211a12] dark:border-white/10">
                        <h2 class="font-serif text-xl font-bold">Facilities</h2>
                        <div class="flex flex-wrap gap-2 mt-3">
                            <span v-for="f in branch.facilities.split(',')" :key="f" class="text-sm bg-cream-100 px-3.5 py-1.5 rounded-full font-medium dark:bg-[#2c2318]">{{ f.trim() }}</span>
                        </div>
                    </div>

                    <div class="bg-white rounded-2xl border border-cream-200 p-5 sm:p-6 dark:bg-[#211a12] dark:border-white/10">
                        <h2 class="font-serif text-xl font-bold">Location</h2>
                        <div id="detail-map" class="h-72 w-full mt-3 rounded-2xl overflow-hidden"></div>
                        <a :href="`https://www.openstreetmap.org/directions?to=${branch.latitude}%2C${branch.longitude}`" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 mt-3 text-sm font-bold text-gold-600 hover:underline dark:text-gold-400">
                            <Navigation class="w-4 h-4" /> Get Directions
                        </a>
                    </div>

                    <div v-if="branch.menus?.length" class="bg-white rounded-2xl border border-cream-200 p-5 sm:p-6 dark:bg-[#211a12] dark:border-white/10">
                        <div class="flex items-center justify-between">
                            <h2 class="font-serif text-xl font-bold">Available here ({{ branch.menus.length }})</h2>
                            <RouterLink to="/menu" class="text-sm font-semibold hover:text-gold-600 transition dark:text-gold-400">Full menu →</RouterLink>
                        </div>
                        <div class="grid sm:grid-cols-2 gap-3 mt-4">
                            <div v-for="m in branch.menus.slice(0, 6)" :key="m.id" class="flex items-center gap-3">
                                <div class="w-12 h-12 rounded-xl bg-cream-100 overflow-hidden shrink-0 flex items-center justify-center dark:bg-[#2c2318]">
                                    <img v-if="m.image" :src="m.image" :alt="m.name" loading="lazy" class="w-full h-full object-cover" />
                                    <UtensilsCrossed v-else class="w-5 h-5 text-espresso-500/40 dark:text-cream-200/70" />
                                </div>
                                <div class="min-w-0"><p class="text-sm font-semibold truncate">{{ m.name }}</p><p class="text-xs text-espresso-700/60 dark:text-cream-200">{{ m.price_formatted }}</p></div>
                            </div>
                        </div>
                    </div>
                </div>

                <aside class="bg-espresso-900 text-cream-50 rounded-3xl p-6 sm:p-7 lg:sticky lg:top-24 text-center">
                    <ConciergeBell class="w-10 h-10 mx-auto text-gold-400" />
                    <h3 class="font-serif text-2xl font-bold mt-3">Craving Saveur?</h3>
                    <p class="text-sm text-cream-200/70 mt-1.5">Order from {{ branch.name }} now — dine in, take away, or delivery.</p>
                    <RouterLink to="/menu" class="block mt-5 font-bold bg-gold-500 text-espresso-900 py-3 rounded-full hover:bg-gold-400 transition">Order Now</RouterLink>
                    <a :href="`tel:${branch.phone.replace(/[^+\d]/g, '')}`" class="block mt-2.5 font-semibold border border-cream-50/25 py-3 rounded-full hover:bg-white/10 transition">Call Branch</a>
                </aside>
            </div>
        </template>
    </div>
</template>

<script setup>
import * as L from 'leaflet';
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ArrowLeft, Clock, ConciergeBell, MapPin, Navigation, Phone, UtensilsCrossed } from 'lucide-vue-next';
import api from '../services/api';
import { useToast } from '../stores/toast';

const route = useRoute();
const { error } = useToast();
const branch = ref(null);
const loading = ref(true);
let map = null;

const heroImage = computed(() => branch.value?.image || {
    downtown: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=70',
    central: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=70',
    'mall-galeria': 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=70',
}[branch.value?.slug] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=70');

onMounted(async () => {
    try {
        const { data } = await api.get(`/branches/${route.params.slug}`);
        branch.value = data.data;
        document.title = `${branch.value.name} — Saveur Restaurant`;
        await nextTick();
        map = L.map('detail-map').setView([branch.value.latitude, branch.value.longitude], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors', maxZoom: 19,
        }).addTo(map);
        L.marker([branch.value.latitude, branch.value.longitude]).addTo(map).bindPopup(branch.value.name).openPopup();
    } catch {
        error('Branch not found.');
    } finally {
        loading.value = false;
    }
});

onBeforeUnmount(() => { map?.remove(); map = null; });
</script>
