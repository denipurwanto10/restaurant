<template>
    <div class="min-h-screen bg-[#f5f1e8] text-espresso-900 dark:bg-[#14100b] dark:text-cream-100">
        <aside
            class="fixed inset-y-0 left-0 w-64 bg-espresso-900 text-cream-100 flex flex-col z-40 transition-transform duration-300"
            :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
        >
            <div class="flex items-center gap-2.5 px-5 h-16 border-b border-white/10">
                <span class="w-9 h-9 rounded-full bg-gold-500 text-espresso-900 flex items-center justify-center font-serif text-xl font-bold">S</span>
                <div>
                    <p class="font-serif text-lg font-bold leading-none">Saveur</p>
                    <p class="text-[11px] text-cream-200/60 uppercase tracking-wider">Admin Panel</p>
                </div>
            </div>
            <nav class="flex-1 overflow-y-auto p-3 space-y-1 text-sm">
                <RouterLink
                    v-for="link in links"
                    :key="link.to"
                    :to="link.to"
                    class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition"
                    :class="$route.path === link.to ? 'bg-gold-500 text-espresso-900 font-semibold' : 'hover:bg-white/10'"
                    @click="sidebarOpen = false"
                >
                    <component :is="link.icon" class="w-[18px] h-[18px]" />
                    {{ link.label }}
                </RouterLink>
            </nav>
            <div class="p-3 border-t border-white/10">
                <button @click="doLogout" class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-white/10 transition text-sm text-left">
                    <LogOut class="w-[18px] h-[18px]" /> Logout
                </button>
            </div>
        </aside>

        <div v-if="sidebarOpen" class="fixed inset-0 bg-black/40 z-30 lg:hidden" @click="sidebarOpen = false"></div>

        <div class="lg:pl-64">
            <header class="sticky top-0 z-20 bg-[#f5f1e8]/90 dark:bg-[#14100b]/90 backdrop-blur border-b border-cream-200 h-16 flex items-center gap-3 px-4 sm:px-8 dark:border-white/10">
                <button @click="sidebarOpen = !sidebarOpen" class="lg:hidden p-2 rounded-lg hover:bg-cream-100 dark:hover:bg-white/10" aria-label="Toggle sidebar">
                    <Menu class="w-5 h-5" />
                </button>
                <h1 class="font-serif text-xl font-bold">{{ pageTitle }}</h1>
                <div class="ml-auto flex items-center gap-2 text-sm">
                    <ThemeToggle />
                    <span class="w-8 h-8 rounded-full bg-espresso-800 text-cream-50 flex items-center justify-center font-semibold">
                        {{ auth.user?.name?.charAt(0).toUpperCase() }}
                    </span>
                    <span class="hidden sm:block font-medium">{{ auth.user?.name }}</span>
                </div>
            </header>
            <main class="p-4 sm:p-8">
                <RouterView />
            </main>
        </div>
        <ToastHost />
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
    BadgePercent, Building2, LayoutDashboard, LogOut, Menu,
    ReceiptText, Shapes, Star, Users, UtensilsCrossed, Wallet,
} from 'lucide-vue-next';
import ToastHost from '../components/ToastHost.vue';
import ThemeToggle from '../components/ThemeToggle.vue';
import { useAuth } from '../stores/auth';
import { useToast } from '../stores/toast';

const route = useRoute();
const router = useRouter();
const auth = useAuth();
const { success } = useToast();
const sidebarOpen = ref(false);

const links = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/orders', label: 'Orders', icon: ReceiptText },
    { to: '/admin/menus', label: 'Menus', icon: UtensilsCrossed },
    { to: '/admin/categories', label: 'Categories', icon: Shapes },
    { to: '/admin/branches', label: 'Branches', icon: Building2 },
    { to: '/admin/payments', label: 'Payments', icon: Wallet },
    { to: '/admin/customers', label: 'Customers', icon: Users },
    { to: '/admin/promos', label: 'Promos', icon: BadgePercent },
    { to: '/admin/reviews', label: 'Reviews', icon: Star },
];

const pageTitle = computed(() => {
    const found = links.find((l) => l.to === route.path);
    return found?.label ?? 'Dashboard';
});

async function doLogout() {
    await auth.logout();
    success('Logged out successfully.');
    router.push('/login');
}
</script>
