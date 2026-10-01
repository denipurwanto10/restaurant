<template>
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 class="font-serif text-4xl sm:text-5xl font-bold">My Orders</h1>
        <p class="text-espresso-700/65 mt-1.5 dark:text-cream-200">Track and revisit your dining history.</p>

        <div v-if="!auth.user" class="text-center py-16 bg-white rounded-3xl border border-cream-200 mt-8 dark:bg-[#211a12] dark:border-white/10">
            <CircleUserRound class="w-12 h-12 mx-auto text-espresso-500/30 dark:text-cream-200/70" />
            <p class="font-serif text-2xl font-bold mt-4">Login to see your orders.</p>
            <RouterLink to="/login" class="inline-block mt-3 font-semibold bg-espresso-900 dark:bg-gold-500 text-cream-50 dark:text-espresso-900 px-6 py-2.5 rounded-full">Login</RouterLink>
        </div>

        <template v-else>
            <div v-if="loading" class="space-y-3 mt-8">
                <div v-for="i in 3" :key="i" class="skeleton h-28 rounded-2xl"></div>
            </div>
            <div v-else-if="!orders.length" class="text-center py-16 bg-white rounded-3xl border border-cream-200 mt-8 dark:bg-[#211a12] dark:border-white/10">
                <ReceiptText class="w-12 h-12 mx-auto text-espresso-500/30 dark:text-cream-200/70" />
                <p class="font-serif text-2xl font-bold mt-4">No orders yet.</p>
                <p class="text-sm text-espresso-700/60 mt-1 dark:text-cream-200">Your delicious history starts with the first bite.</p>
                <RouterLink to="/menu" class="inline-block mt-3 font-semibold bg-espresso-900 dark:bg-gold-500 text-cream-50 dark:text-espresso-900 px-6 py-2.5 rounded-full">Order Now</RouterLink>
            </div>
            <div v-else class="grid gap-4 mt-8">
                <RouterLink
                    v-for="o in orders"
                    :key="o.id"
                    :to="`/orders/${o.order_number}`"
                    class="bg-white rounded-2xl border border-cream-200 p-5 flex flex-col sm:flex-row sm:items-center gap-3 hover:shadow-lg hover:-translate-y-0.5 transition-all dark:bg-[#211a12] dark:border-white/10"
                >
                    <div class="flex-1">
                        <p class="font-mono font-bold text-[15px]">{{ o.order_number }}</p>
                        <p class="text-sm text-espresso-700/60 mt-0.5 dark:text-cream-200">{{ formatDate(o.created_at) }} · {{ o.items?.length ?? o.items_count ?? '' }} items · {{ o.branch?.name }}</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <StatusPill :value="o.status" />
                        <StatusPill :value="o.payment_status" />
                    </div>
                    <p class="font-serif text-lg font-bold sm:text-right">{{ o.total_formatted }}</p>
                </RouterLink>
            </div>
        </template>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { CircleUserRound, ReceiptText } from 'lucide-vue-next';
import api from '../services/api';
import { useAuth } from '../stores/auth';
import StatusPill from '../components/StatusPill.vue';

const auth = useAuth();
const orders = ref([]);
const loading = ref(true);

function formatDate(iso) {
    return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

onMounted(async () => {
    document.title = 'My Orders — Saveur Restaurant';
    if (!auth.user) {
        loading.value = false;
        return;
    }
    try {
        const { data } = await api.get('/orders');
        orders.value = data.data;
    } catch { /* ignore */ }
    finally {
        loading.value = false;
    }
});
</script>
