<template>
    <header class="sticky top-0 z-40 bg-cream-50/90 dark:bg-[#14100b]/90 backdrop-blur border-b border-cream-200 dark:border-white/10">
        <nav class="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
            <RouterLink to="/" class="flex items-center gap-2.5">
                <span class="w-9 h-9 rounded-full bg-espresso-900 text-gold-400 flex items-center justify-center font-serif text-xl font-bold">S</span>
                <span class="font-serif text-2xl font-bold tracking-tight text-espresso-900 dark:text-cream-100">Saveur</span>
            </RouterLink>

            <div class="hidden md:flex items-center gap-8 text-sm font-medium text-espresso-700 dark:text-cream-200">
                <RouterLink to="/" class="hover:text-gold-600 transition dark:text-gold-400" active-class="text-espresso-900 dark:text-gold-400 font-semibold">Home</RouterLink>
                <RouterLink to="/menu" class="hover:text-gold-600 transition dark:text-gold-400" active-class="text-espresso-900 dark:text-gold-400 font-semibold">Menu</RouterLink>
                <RouterLink to="/branches" class="hover:text-gold-600 transition dark:text-gold-400" active-class="text-espresso-900 dark:text-gold-400 font-semibold">Branches</RouterLink>
                <RouterLink to="/about" class="hover:text-gold-600 transition dark:text-gold-400" active-class="text-espresso-900 dark:text-gold-400 font-semibold">About</RouterLink>
                <RouterLink v-if="auth.user?.role === 'admin'" to="/admin" class="hover:text-gold-600 transition dark:text-gold-400">Dashboard</RouterLink>
            </div>

            <div class="flex items-center gap-1.5 sm:gap-3">
                <ThemeToggle />
                <button
                    @click="$emit('open-cart')"
                    class="relative p-2.5 rounded-full hover:bg-cream-100 transition dark:hover:bg-white/10"
                    aria-label="Open cart"
                >
                    <ShoppingBag class="w-5 h-5 text-espresso-800 dark:text-cream-100" />
                    <span
                        v-if="cart.count > 0"
                        class="absolute -top-0.5 -right-0.5 min-w-[1.25rem] h-5 px-1 rounded-full bg-gold-500 text-espresso-900 text-xs font-bold flex items-center justify-center"
                    >{{ cart.count }}</span>
                </button>

                <template v-if="auth.user">
                    <div class="relative hidden sm:block" ref="menuRef">
                        <button @click="open = !open" class="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-cream-100 transition dark:hover:bg-white/10">
                            <span class="w-8 h-8 rounded-full bg-espresso-800 text-cream-50 flex items-center justify-center text-sm font-semibold">
                                {{ auth.user.name.charAt(0).toUpperCase() }}
                            </span>
                            <ChevronDown class="w-4 h-4 text-espresso-600 dark:text-gold-400" />
                        </button>
                        <div v-if="open" class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-cream-200 py-1.5 text-sm dark:bg-[#211a12] dark:border-white/10">
                            <RouterLink to="/orders" class="flex items-center gap-2 px-4 py-2.5 hover:bg-cream-100 transition dark:hover:bg-white/10" @click="open = false">
                                <ReceiptText class="w-4 h-4" /> My Orders
                            </RouterLink>
                            <button @click="doLogout" class="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-cream-100 transition text-left dark:hover:bg-white/10">
                                <LogOut class="w-4 h-4" /> Logout
                            </button>
                        </div>
                    </div>
                    <RouterLink to="/orders" class="sm:hidden p-2.5 rounded-full hover:bg-cream-100 transition dark:hover:bg-white/10" aria-label="My orders">
                        <CircleUserRound class="w-5 h-5 text-espresso-800 dark:text-cream-100" />
                    </RouterLink>
                </template>
                <RouterLink
                    v-else
                    to="/login"
                    class="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold bg-espresso-900 text-cream-50 px-5 py-2.5 rounded-full hover:bg-espresso-700 dark:bg-gold-500 dark:text-espresso-900 dark:hover:bg-gold-400 transition"
                >
                    <CircleUserRound class="w-4 h-4" /> Login
                </RouterLink>

                <button @click="mobileOpen = !mobileOpen" class="md:hidden p-2.5 rounded-full hover:bg-cream-100 transition dark:hover:bg-white/10" aria-label="Menu">
                    <X v-if="mobileOpen" class="w-5 h-5" />
                    <Menu v-else class="w-5 h-5" />
                </button>
            </div>
        </nav>

        <Transition name="modal">
            <div v-if="mobileOpen" class="md:hidden border-t border-cream-200 bg-cream-50 px-4 py-3 space-y-1 text-[15px] font-medium dark:border-white/10 dark:bg-[#14100b]">
                <RouterLink to="/" class="block px-3 py-2.5 rounded-lg hover:bg-cream-100 dark:hover:bg-white/10" @click="mobileOpen = false">Home</RouterLink>
                <RouterLink to="/menu" class="block px-3 py-2.5 rounded-lg hover:bg-cream-100 dark:hover:bg-white/10" @click="mobileOpen = false">Menu</RouterLink>
                <RouterLink to="/branches" class="block px-3 py-2.5 rounded-lg hover:bg-cream-100 dark:hover:bg-white/10" @click="mobileOpen = false">Branches</RouterLink>
                <RouterLink to="/about" class="block px-3 py-2.5 rounded-lg hover:bg-cream-100 dark:hover:bg-white/10" @click="mobileOpen = false">About</RouterLink>
                <RouterLink v-if="auth.user" to="/orders" class="block px-3 py-2.5 rounded-lg hover:bg-cream-100 dark:hover:bg-white/10" @click="mobileOpen = false">My Orders</RouterLink>
                <RouterLink v-if="auth.user?.role === 'admin'" to="/admin" class="block px-3 py-2.5 rounded-lg hover:bg-cream-100 dark:hover:bg-white/10" @click="mobileOpen = false">Dashboard</RouterLink>
                <button v-if="auth.user" @click="doLogout" class="w-full text-left px-3 py-2.5 rounded-lg hover:bg-cream-100 text-red-700 dark:text-red-400 dark:hover:bg-white/10">Logout</button>
                <RouterLink v-else to="/login" class="block px-3 py-2.5 rounded-lg bg-espresso-900 dark:bg-gold-500 text-cream-50 dark:text-espresso-900 text-center font-semibold" @click="mobileOpen = false">Login</RouterLink>
            </div>
        </Transition>
    </header>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ChevronDown, CircleUserRound, LogOut, Menu, ReceiptText, ShoppingBag, X } from 'lucide-vue-next';
import ThemeToggle from './ThemeToggle.vue';
import { useAuth } from '../stores/auth';
import { useCart } from '../stores/cart';
import { useToast } from '../stores/toast';

defineEmits(['open-cart']);

const router = useRouter();
const auth = useAuth();
const cart = useCart();
const { success } = useToast();
const open = ref(false);
const mobileOpen = ref(false);
const menuRef = ref(null);

function onClickOutside(e) {
    if (menuRef.value && !menuRef.value.contains(e.target)) open.value = false;
}
onMounted(() => document.addEventListener('click', onClickOutside));
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside));

async function doLogout() {
    await auth.logout();
    open.value = false;
    mobileOpen.value = false;
    success('Logged out successfully.');
    router.push('/');
}
</script>
