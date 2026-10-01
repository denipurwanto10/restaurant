<template>
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-gold-600 dark:text-gold-400">About Saveur</p>
        <h1 class="font-serif text-4xl sm:text-6xl font-black mt-2 leading-tight">Fire, flavor & twelve years of craft.</h1>
        <div class="rounded-[2rem] overflow-hidden mt-8 aspect-[21/9] bg-cream-100 dark:bg-[#2c2318]">
            <img src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1400&q=70" alt="Saveur restaurant interior" class="w-full h-full object-cover" />
        </div>
        <div class="grid sm:grid-cols-2 gap-8 mt-10 text-espresso-700/80 leading-relaxed dark:text-cream-200">
            <p>Founded in 2012 in Jakarta's SCBD district, Saveur began as a twelve-table dining room with one wood-fired oven and a stubborn belief: great food needs no pretense. Today we serve thousands of guests across three branches — yet every sauce is still finished to order, every steak still rested before it meets the plate.</p>
            <p>Our kitchen blends European technique with Indonesian soul — black truffle meets sambal philosophy, single-origin coffee meets slow mornings. Whether you dine in, take away, or order delivery, the promise is the same: crafted with passion, served with soul.</p>
        </div>
        <div class="grid grid-cols-3 gap-4 mt-10 text-center">
            <div class="bg-white rounded-2xl border border-cream-200 p-6 dark:bg-[#211a12] dark:border-white/10"><p class="font-serif text-3xl sm:text-4xl font-bold">12+</p><p class="text-sm text-espresso-700/60 mt-1 dark:text-cream-200">Years of craft</p></div>
            <div class="bg-white rounded-2xl border border-cream-200 p-6 dark:bg-[#211a12] dark:border-white/10"><p class="font-serif text-3xl sm:text-4xl font-bold">24+</p><p class="text-sm text-espresso-700/60 mt-1 dark:text-cream-200">Signature dishes</p></div>
            <div class="bg-white rounded-2xl border border-cream-200 p-6 dark:bg-[#211a12] dark:border-white/10"><p class="font-serif text-3xl sm:text-4xl font-bold">3</p><p class="text-sm text-espresso-700/60 mt-1 dark:text-cream-200">City branches</p></div>
        </div>
        <div class="text-center mt-12">
            <RouterLink to="/menu" class="inline-flex items-center gap-2 bg-espresso-900 text-cream-50 font-semibold px-8 py-3.5 rounded-full hover:bg-espresso-700 dark:bg-gold-500 dark:text-espresso-900 dark:hover:bg-gold-400 transition">Taste Our Menu <ArrowRight class="w-4 h-4" /></RouterLink>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { ArrowRight } from 'lucide-vue-next';

onMounted(() => { document.title = 'About — Saveur Restaurant'; });
</script>
