<template>
    <div class="space-y-6">
        <div class="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <div v-for="s in statCards" :key="s.label" class="bg-white rounded-2xl border border-cream-200 p-5 dark:bg-[#211a12] dark:border-white/10">
                <div class="flex items-center justify-between">
                    <span class="w-10 h-10 rounded-xl flex items-center justify-center" :class="s.bg"><component :is="s.icon" class="w-5 h-5" /></span>
                </div>
                <p class="font-serif text-2xl sm:text-3xl font-bold mt-3">{{ s.value }}</p>
                <p class="text-[13px] text-espresso-700/60 dark:text-cream-200">{{ s.label }}</p>
            </div>
        </div>

        <div class="grid lg:grid-cols-2 gap-4">
            <div class="bg-white rounded-2xl border border-cream-200 p-5 sm:p-6 dark:bg-[#211a12] dark:border-white/10">
                <h3 class="font-serif text-lg font-bold">Revenue — last 14 days</h3>
                <div class="flex items-end gap-1.5 h-44 mt-5">
                    <div v-for="d in data.revenue_chart" :key="d.date" class="flex-1 flex flex-col items-center gap-1.5 h-full justify-end" :title="`${d.date}: Rp ${Number(d.revenue).toLocaleString('id-ID')}`">
                        <span class="text-[10px] font-bold text-espresso-700/50 hidden sm:block dark:text-cream-200">{{ shortNum(d.revenue) }}</span>
                        <div class="w-full rounded-t-lg bg-espresso-900 hover:bg-gold-500 transition min-h-1 dark:bg-gold-500 dark:hover:bg-gold-400" :style="{ height: barHeight(d.revenue) }"></div>
                        <span class="text-[10px] text-espresso-700/50 dark:text-cream-200">{{ dayLabel(d.date) }}</span>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-2xl border border-cream-200 p-5 sm:p-6 dark:bg-[#211a12] dark:border-white/10">
                <h3 class="font-serif text-lg font-bold">Orders by status (30 days)</h3>
                <div class="mt-5 space-y-3">
                    <div v-for="(count, status) in data.orders_by_status" :key="status" class="flex items-center gap-3 text-sm">
                        <span class="w-24 font-medium capitalize">{{ status }}</span>
                        <div class="flex-1 h-3 rounded-full bg-cream-100 overflow-hidden dark:bg-[#2c2318]">
                            <div class="h-full rounded-full bg-gold-500" :style="{ width: pct(count) }"></div>
                        </div>
                        <span class="font-bold w-8 text-right">{{ count }}</span>
                    </div>
                    <p v-if="!Object.keys(data.orders_by_status || {}).length" class="text-sm text-espresso-700/50 dark:text-cream-200">No orders in the last 30 days.</p>
                </div>
                <h3 class="font-serif text-lg font-bold mt-7">Popular menus</h3>
                <ul class="mt-3 space-y-2 text-sm">
                    <li v-for="m in data.popular_menus" :key="m.id" class="flex justify-between gap-2">
                        <span class="truncate">{{ m.name }}</span>
                        <span class="font-bold shrink-0">{{ m.sold_count }} sold</span>
                    </li>
                </ul>
            </div>
        </div>

        <div class="bg-white rounded-2xl border border-cream-200 p-5 sm:p-6 dark:bg-[#211a12] dark:border-white/10">
            <div class="flex items-center justify-between">
                <h3 class="font-serif text-lg font-bold">Recent orders</h3>
                <RouterLink to="/admin/orders" class="text-sm font-semibold hover:text-gold-600 dark:text-gold-400">View all →</RouterLink>
            </div>
            <div class="overflow-x-auto mt-3">
                <table class="w-full text-sm min-w-[640px]">
                    <thead><tr class="text-left text-espresso-700/55 text-xs uppercase tracking-wide dark:text-cream-200">
                        <th class="py-2.5 pr-3">Order</th><th class="py-2.5 pr-3">Customer</th><th class="py-2.5 pr-3">Total</th><th class="py-2.5 pr-3">Status</th><th class="py-2.5">Payment</th>
                    </tr></thead>
                    <tbody>
                        <tr v-for="o in data.recent_orders" :key="o.id" class="border-t border-cream-100 dark:border-white/10">
                            <td class="py-2.5 pr-3 font-mono font-bold">{{ o.order_number }}</td>
                            <td class="py-2.5 pr-3">{{ o.customer_name }}</td>
                            <td class="py-2.5 pr-3 font-semibold">{{ o.total_formatted }}</td>
                            <td class="py-2.5 pr-3"><StatusPill :value="o.status" /></td>
                            <td class="py-2.5"><StatusPill :value="o.payment_status" /></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { ReceiptText, ShoppingBag, Users, Wallet } from 'lucide-vue-next';
import api from '../services/api';
import StatusPill from '../components/StatusPill.vue';
import { formatRupiah } from '../stores/cart';

const data = ref({ stats: {}, revenue_chart: [], orders_by_status: {}, popular_menus: [], recent_orders: [] });

const statCards = computed(() => [
    { label: 'Total Orders', value: data.value.stats.total_orders ?? '–', icon: ReceiptText, bg: 'bg-cream-100 text-espresso-800 dark:bg-[#2c2318] dark:text-gold-400' },
    { label: "Today's Orders", value: data.value.stats.today_orders ?? '–', icon: ShoppingBag, bg: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400' },
    { label: 'Total Revenue', value: formatRupiah(data.value.stats.total_revenue ?? 0), icon: Wallet, bg: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400' },
    { label: 'Total Customers', value: data.value.stats.total_customers ?? '–', icon: Users, bg: 'bg-gold-500/15 text-gold-600 dark:text-gold-400' },
]);

function shortNum(n) {
    n = Number(n);
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'jt';
    if (n >= 1000) return (n / 1000).toFixed(0) + 'rb';
    return n;
}
function dayLabel(date) {
    return new Date(date + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'numeric' });
}
function barHeight(v) {
    const max = Math.max(...data.value.revenue_chart.map((d) => Number(d.revenue)), 1);
    return `${Math.max(4, (Number(v) / max) * 100)}%`;
}
function pct(count) {
    const total = Object.values(data.value.orders_by_status || {}).reduce((a, b) => a + Number(b), 0) || 1;
    return `${(Number(count) / total) * 100}%`;
}

onMounted(async () => {
    const { data: res } = await api.get('/admin/dashboard');
    data.value = res;
});
</script>
