<template>
    <header
        class="sticky top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-500 border-b"
        :class="scrolled || mobileOpen
            ? 'bg-cream-50/80 dark:bg-[#110d09]/80 backdrop-blur-xl border-espresso-900/10 dark:border-white/10'
            : 'bg-transparent border-transparent'"
    >
        <nav class="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between transition-[height] duration-500" :class="scrolled ? 'h-14' : 'h-[4.5rem]'">
            <RouterLink to="/" class="flex items-baseline gap-1 group" @click="mobileOpen = false">
                <span class="font-serif text-[1.75rem] leading-none text-espresso-900 dark:text-cream-100">Saveur</span>
                <span class="w-1.5 h-1.5 rounded-full bg-gold-500 transition-transform duration-500 group-hover:scale-150"></span>
            </RouterLink>

            <div class="hidden md:flex items-center gap-9 text-[13px] tracking-wide text-espresso-600 dark:text-cream-200">
                <RouterLink to="/" class="link-line py-1 transition-colors hover:text-espresso-900 dark:hover:text-gold-400" active-class="text-espresso-900 dark:text-gold-400">Home</RouterLink>
                <RouterLink to="/menu" class="link-line py-1 transition-colors hover:text-espresso-900 dark:hover:text-gold-400" active-class="text-espresso-900 dark:text-gold-400">Menu</RouterLink>
                <RouterLink to="/branches" class="link-line py-1 transition-colors hover:text-espresso-900 dark:hover:text-gold-400" active-class="text-espresso-900 dark:text-gold-400">Branches</RouterLink>
                <RouterLink to="/about" class="link-line py-1 transition-colors hover:text-espresso-900 dark:hover:text-gold-400" active-class="text-espresso-900 dark:text-gold-400">About</RouterLink>
                <RouterLink v-if="auth.user?.role === 'admin'" to="/admin" class="link-line py-1 hover:text-espresso-900 dark:hover:text-gold-400">Dashboard</RouterLink>
            </div>

            <div class="flex items-center gap-1 sm:gap-2">
                <ThemeToggle />
                <button @click="$emit('open-cart')" class="relative p-2.5 rounded-full hover:bg-espresso-900/5 dark:hover:bg-white/10" aria-label="Open cart">
                    <ShoppingBag class="w-[18px] h-[18px] text-espresso-800 dark:text-cream-100" />
                    <span
                        v-if="cart.count > 0"
                        :key="cart.count"
                        class="animate-pop absolute top-0.5 right-0 min-w-[1.1rem] h-[1.1rem] px-1 rounded-full bg-gold-500 text-espresso-900 text-[10px] font-semibold flex items-center justify-center"
                    >{{ cart.count }}</span>
                </button>

                <template v-if="auth.user">
                    <div class="relative hidden sm:block" ref="menuRef">
                        <button @click="open = !open" class="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full hover:bg-espresso-900/5 dark:hover:bg-white/10">
                            <span class="w-8 h-8 rounded-full bg-espresso-900 text-cream-50 dark:bg-gold-500 dark:text-espresso-900 flex items-center justify-center text-xs font-semibold">
                                {{ auth.user.name.charAt(0).toUpperCase() }}
                            </span>
                            <ChevronDown class="w-3.5 h-3.5 text-espresso-600 dark:text-gold-400 transition-transform duration-500" :class="open && 'rotate-180'" />
                        </button>
                        <Transition name="modal">
                            <div v-if="open" class="absolute right-0 mt-3 w-52 origin-top-right bg-cream-50 dark:bg-[#1b1510] rounded-[1.25rem] shadow-lift border border-espresso-900/10 dark:border-white/10 p-1.5 text-sm">
                                <RouterLink to="/orders" class="flex items-center gap-2.5 px-3 py-2.5 rounded-[0.875rem] hover:bg-espresso-900/5 dark:hover:bg-white/10" @click="open = false">
                                    <ReceiptText class="w-4 h-4" /> My Orders
                                </RouterLink>
                                <button @click="doLogout" class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[0.875rem] hover:bg-espresso-900/5 dark:hover:bg-white/10 text-left">
                                    <LogOut class="w-4 h-4" /> Logout
                                </button>
                            </div>
                        </Transition>
                    </div>
                    <RouterLink to="/orders" class="sm:hidden p-2.5 rounded-full hover:bg-espresso-900/5 dark:hover:bg-white/10" aria-label="My orders">
                        <CircleUserRound class="w-[18px] h-[18px] text-espresso-800 dark:text-cream-100" />
                    </RouterLink>
                </template>
                <RouterLink
                    v-else
                    to="/login"
                    class="hidden sm:inline-flex items-center text-[13px] font-medium bg-espresso-900 text-cream-50 px-5 py-2 rounded-full hover:bg-espresso-700 dark:bg-gold-500 dark:text-espresso-900 dark:hover:bg-gold-400"
                >Login</RouterLink>

                <button @click="mobileOpen = !mobileOpen" class="md:hidden relative w-10 h-10 rounded-full hover:bg-espresso-900/5 dark:hover:bg-white/10" aria-label="Menu" :aria-expanded="mobileOpen">
                    <span class="absolute left-1/2 top-1/2 w-5 h-px bg-current transition-transform duration-500" :class="mobileOpen ? 'rotate-45' : '-translate-y-[4px]'" style="margin-left:-10px"></span>
                    <span class="absolute left-1/2 top-1/2 w-5 h-px bg-current transition-transform duration-500" :class="mobileOpen ? '-rotate-45' : 'translate-y-[3px]'" style="margin-left:-10px"></span>
                </button>
            </div>
        </nav>

        <Transition name="fade">
            <div v-if="mobileOpen" class="md:hidden fixed inset-x-0 top-0 bottom-0 -z-10 bg-cream-50 dark:bg-[#110d09] pt-24 px-6 pb-10 overflow-y-auto">
                <div class="sheet">
                    <RouterLink to="/" class="sheet-item block py-3.5 font-serif text-4xl border-b border-espresso-900/10 dark:border-white/10" :style="{ '--i': 0 }" @click="mobileOpen = false">Home</RouterLink>
                    <RouterLink to="/menu" class="sheet-item block py-3.5 font-serif text-4xl border-b border-espresso-900/10 dark:border-white/10" :style="{ '--i': 1 }" @click="mobileOpen = false">Menu</RouterLink>
                    <RouterLink to="/branches" class="sheet-item block py-3.5 font-serif text-4xl border-b border-espresso-900/10 dark:border-white/10" :style="{ '--i': 2 }" @click="mobileOpen = false">Branches</RouterLink>
                    <RouterLink to="/about" class="sheet-item block py-3.5 font-serif text-4xl border-b border-espresso-900/10 dark:border-white/10" :style="{ '--i': 3 }" @click="mobileOpen = false">About</RouterLink>
                    <RouterLink v-if="auth.user" to="/orders" class="sheet-item block py-3.5 font-serif text-4xl border-b border-espresso-900/10 dark:border-white/10" style="--i:4" @click="mobileOpen = false">Orders</RouterLink>
                    <RouterLink v-if="auth.user?.role === 'admin'" to="/admin" class="sheet-item block py-3.5 font-serif text-4xl border-b border-espresso-900/10 dark:border-white/10" style="--i:5" @click="mobileOpen = false">Dashboard</RouterLink>
                </div>
                <div class="sheet-item mt-8" style="--i:6">
                    <button v-if="auth.user" @click="doLogout" class="text-sm text-espresso-600 dark:text-cream-200 underline underline-offset-4">Logout</button>
                    <RouterLink v-else to="/login" class="block text-center bg-espresso-900 dark:bg-gold-500 text-cream-50 dark:text-espresso-900 font-medium py-3.5 rounded-full" @click="mobileOpen = false">Login</RouterLink>
                </div>
            </div>
        </Transition>
    </header>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ChevronDown, CircleUserRound, LogOut, ReceiptText, ShoppingBag } from 'lucide-vue-next';
import ThemeToggle from './ThemeToggle.vue';
import { useAuth } from '../stores/auth';
import { useCart } from '../stores/cart';
import { useToast } from '../stores/toast';

defineEmits(['open-cart']);

const router = useRouter();
const route = useRoute();
const auth = useAuth();
const cart = useCart();
const { success } = useToast();
const open = ref(false);
const mobileOpen = ref(false);
const scrolled = ref(false);
const menuRef = ref(null);

function onClickOutside(e) {
    if (menuRef.value && !menuRef.value.contains(e.target)) open.value = false;
}
const onScroll = () => { scrolled.value = window.scrollY > 24; };

onMounted(() => {
    document.addEventListener('click', onClickOutside);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
});
onBeforeUnmount(() => {
    document.removeEventListener('click', onClickOutside);
    window.removeEventListener('scroll', onScroll);
    document.body.style.overflow = '';
});
watch(mobileOpen, (v) => { document.body.style.overflow = v ? 'hidden' : ''; });
watch(() => route.fullPath, () => { mobileOpen.value = false; open.value = false; });

async function doLogout() {
    await auth.logout();
    open.value = false;
    mobileOpen.value = false;
    success('Logged out successfully.');
    router.push('/');
}
</script>

<style scoped>
.sheet-item { animation: rise .8s var(--ease) both; animation-delay: calc(var(--i) * 60ms + 120ms); }
</style>
