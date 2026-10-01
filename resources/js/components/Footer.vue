<template>
    <footer class="bg-espresso-900 text-cream-100 mt-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid gap-10 md:grid-cols-4">
            <div>
                <div class="flex items-center gap-2.5 mb-4">
                    <span class="w-9 h-9 rounded-full bg-gold-500 text-espresso-900 flex items-center justify-center font-serif text-xl font-bold">S</span>
                    <span class="font-serif text-2xl font-bold">Saveur</span>
                </div>
                <p class="text-sm text-cream-200/70 leading-relaxed">Crafted with Passion, Served with Soul. Fine dining experiences across Jakarta since 2012.</p>
                <div class="flex gap-2 mt-5">
                    <a href="#" class="w-9 h-9 rounded-full bg-white/10 hover:bg-gold-500 hover:text-espresso-900 flex items-center justify-center transition dark:hover:text-gold-400" aria-label="Instagram"><Camera class="w-4 h-4" /></a>
                    <a href="#" class="w-9 h-9 rounded-full bg-white/10 hover:bg-gold-500 hover:text-espresso-900 flex items-center justify-center transition dark:hover:text-gold-400" aria-label="Community"><AtSign class="w-4 h-4" /></a>
                    <a href="#" class="w-9 h-9 rounded-full bg-white/10 hover:bg-gold-500 hover:text-espresso-900 flex items-center justify-center transition dark:hover:text-gold-400" aria-label="Share"><Share2 class="w-4 h-4" /></a>
                    <ThemeToggle on-dark-surface />
                </div>
            </div>
            <div>
                <h4 class="font-semibold mb-4 text-gold-400 text-sm uppercase tracking-wider">Explore</h4>
                <ul class="space-y-2.5 text-sm text-cream-200/80">
                    <li><RouterLink to="/" class="hover:text-gold-400 transition">Home</RouterLink></li>
                    <li><RouterLink to="/menu" class="hover:text-gold-400 transition">Menu</RouterLink></li>
                    <li><RouterLink to="/branches" class="hover:text-gold-400 transition">Branches</RouterLink></li>
                    <li><RouterLink to="/about" class="hover:text-gold-400 transition">About Us</RouterLink></li>
                </ul>
            </div>
            <div>
                <h4 class="font-semibold mb-4 text-gold-400 text-sm uppercase tracking-wider">Opening Hours</h4>
                <ul class="space-y-2.5 text-sm text-cream-200/80">
                    <li class="flex items-center gap-2"><Clock class="w-4 h-4" /> Mon – Fri · 10:00 – 22:00</li>
                    <li class="flex items-center gap-2"><Clock class="w-4 h-4" /> Sat – Sun · 09:00 – 23:00</li>
                </ul>
            </div>
            <div>
                <h4 class="font-semibold mb-4 text-gold-400 text-sm uppercase tracking-wider">Contact</h4>
                <ul class="space-y-2.5 text-sm text-cream-200/80">
                    <li class="flex items-center gap-2"><Phone class="w-4 h-4" /> 021-50801234</li>
                    <li class="flex items-center gap-2"><Mail class="w-4 h-4" /> hello@saveur.test</li>
                    <li class="flex items-start gap-2"><MapPin class="w-4 h-4 mt-0.5" /> Jl. Sudirman Kav. 52-53, Jakarta</li>
                </ul>
            </div>
        </div>
        <div class="border-t border-white/10">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 py-5 text-xs text-cream-200/50 flex flex-col sm:flex-row justify-between gap-2">
                <span>© 2026 Saveur Restaurant. All rights reserved.</span>
                <span>Demo project — payments are simulated, no real money is charged.</span>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { AtSign, Camera, Clock, Mail, MapPin, Phone, Share2 } from 'lucide-vue-next';
import ThemeToggle from './ThemeToggle.vue';
</script>
