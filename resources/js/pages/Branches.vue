<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-gold-600 dark:text-gold-400">Find Us</p>
        <h1 class="font-serif text-4xl sm:text-5xl font-bold mt-1">Our Branches</h1>

        <div class="grid lg:grid-cols-[1fr_360px] gap-6 mt-8 items-start">
            <div class="rounded-3xl overflow-hidden border border-cream-200 shadow-sm bg-white dark:border-white/10 dark:bg-[#211a12]">
                <div id="branch-map" class="h-[300px] sm:h-[520px] w-full"></div>
            </div>

            <div class="space-y-4">
                <button
                    v-for="b in branches"
                    :key="b.id"
                    @click="selectBranch(b)"
                    class="w-full text-left bg-white rounded-2xl border-2 p-5 transition hover:shadow-lg dark:bg-[#211a12]"
                    :class="selected?.id === b.id ? 'border-espresso-900 dark:border-gold-500' : 'border-cream-200 dark:border-white/10'"
                >
                    <div class="flex items-start justify-between gap-2">
                        <h3 class="font-serif text-xl font-bold">{{ b.name }}</h3>
                        <span v-if="selected?.id === b.id" class="text-[11px] font-bold bg-espresso-900 text-gold-400 px-2.5 py-1 rounded-full shrink-0">SELECTED</span>
                    </div>
                    <p class="text-sm text-espresso-700/65 mt-1 flex items-start gap-1.5 dark:text-cream-200"><MapPin class="w-3.5 h-3.5 mt-0.5 shrink-0" /> {{ b.address }}, {{ b.city }}</p>
                    <p class="text-sm text-espresso-700/65 mt-1 flex items-center gap-1.5 dark:text-cream-200"><Phone class="w-3.5 h-3.5 shrink-0" /> {{ b.phone }}</p>
                    <p class="text-sm text-espresso-700/65 mt-1 flex items-center gap-1.5 dark:text-cream-200"><Clock class="w-3.5 h-3.5 shrink-0" /> {{ b.opening_hours }}</p>
                    <div class="flex gap-2 mt-3.5">
                        <RouterLink :to="`/branches/${b.slug}`" @click.stop class="text-xs font-bold bg-espresso-900 text-cream-50 px-4 py-2 rounded-full hover:bg-espresso-700 dark:bg-gold-500 dark:text-espresso-900 dark:hover:bg-gold-400 transition">View Details</RouterLink>
                        <a :href="directionsUrl(b)" target="_blank" rel="noopener" @click.stop class="text-xs font-bold border border-espresso-900/20 dark:border-white/20 px-4 py-2 rounded-full hover:border-espresso-900 dark:hover:border-gold-400 transition">Get Directions</a>
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import * as L from 'leaflet';
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Clock, MapPin, Phone } from 'lucide-vue-next';
import api from '../services/api';
import { useToast } from '../stores/toast';

const router = useRouter();

const branches = ref([]);
const selected = ref(null);
const { error } = useToast();
let map = null;
let markers = {};

function directionsUrl(b) {
    return `https://www.openstreetmap.org/directions?to=${b.latitude}%2C${b.longitude}`;
}

function selectBranch(b) {
    selected.value = b;
    if (map) {
        map.flyTo([b.latitude, b.longitude], 15, { duration: 0.8 });
        markers[b.id]?.openPopup();
    }
}

function initMap() {
    map = L.map('branch-map').setView([-6.2297, 106.8294], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
    }).addTo(map);

    branches.value.forEach((b) => {
        const marker = L.marker([b.latitude, b.longitude]).addTo(map);
        marker.bindPopup(`
            <div style="min-width:200px">
                <b style="font-size:15px">${b.name}</b><br>
                <span style="font-size:12px;color:#57462f">${b.address}</span><br>
                <span style="font-size:12px">${b.phone} · ${b.opening_hours}</span><br>
                <button data-branch-slug="${b.slug}" class="popup-detail-btn" style="margin-top:8px;font-size:12px;font-weight:bold;color:#a67c28;cursor:pointer;background:none;border:none;padding:0">View Details →</button>
            </div>
        `);
        marker.on('popupopen', (e) => {
            e.popup.getElement()?.querySelector('.popup-detail-btn')?.addEventListener('click', () => {
                router.push(`/branches/${b.slug}`);
            });
        });
        marker.on('click', () => { selected.value = b; });
        markers[b.id] = marker;
    });
}

onMounted(async () => {
    document.title = 'Branches — Saveur Restaurant';
    try {
        const { data } = await api.get('/branches');
        branches.value = data.data;
        selected.value = branches.value[0] ?? null;
        await nextTick();
        initMap();
    } catch {
        error('Failed to load branches.');
    }
});

onBeforeUnmount(() => {
    map?.remove();
    map = null;
    markers = {};
});
</script>
