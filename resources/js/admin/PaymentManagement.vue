<template>
    <div class="space-y-5">
        <div class="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div class="relative flex-1 max-w-md">
                <Search class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-500/50 dark:text-cream-200/70" />
                <input v-model="search" type="text" placeholder="Search invoice…" class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 dark:border-white/10 dark:bg-[#211a12] dark:focus:ring-gold-400/40" />
            </div>
            <select v-model="status" class="px-4 py-2.5 rounded-xl border border-cream-200 bg-white text-sm dark:border-white/10 dark:bg-[#211a12]">
                <option value="">All statuses</option>
                <option value="pending">pending</option>
                <option value="paid">paid</option>
                <option value="failed">failed</option>
                <option value="expired">expired</option>
            </select>
        </div>
        <p class="text-xs inline-flex items-center gap-1.5 bg-gold-500/10 text-gold-600 font-semibold px-3 py-1.5 rounded-full w-fit dark:text-gold-400">
            <FlaskConical class="w-3.5 h-3.5" /> All payments are simulated demos — no real money.
        </p>
        <div class="bg-white rounded-2xl border border-cream-200 overflow-hidden dark:bg-[#211a12] dark:border-white/10">
            <div class="overflow-x-auto">
                <table class="w-full text-sm min-w-[720px]">
                    <thead><tr class="text-left text-xs uppercase tracking-wide text-espresso-700/55 bg-cream-50 dark:bg-[#14100b] dark:text-cream-200">
                        <th class="px-4 py-3">Invoice</th><th class="px-4 py-3">Order</th><th class="px-4 py-3">Method</th><th class="px-4 py-3">Amount</th><th class="px-4 py-3">Status</th><th class="px-4 py-3">Date</th>
                    </tr></thead>
                    <tbody>
                        <tr v-for="p in payments" :key="p.id" class="border-t border-cream-100 dark:border-white/10">
                            <td class="px-4 py-3 font-mono font-bold">{{ p.invoice_number }}</td>
                            <td class="px-4 py-3 font-mono text-espresso-700/70 dark:text-cream-200">{{ p.order?.order_number }}</td>
                            <td class="px-4 py-3">{{ p.payment_method_name }}</td>
                            <td class="px-4 py-3 font-semibold">{{ p.amount_formatted }}</td>
                            <td class="px-4 py-3"><StatusPill :value="p.status" /></td>
                            <td class="px-4 py-3 text-espresso-700/60 dark:text-cream-200">{{ formatDate(p.created_at) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p v-if="!payments.length && !loading" class="text-center text-sm text-espresso-700/60 py-10 dark:text-cream-200">No payments found.</p>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { FlaskConical, Search } from 'lucide-vue-next';
import api from '../services/api';
import StatusPill from '../components/StatusPill.vue';

const payments = ref([]);
const loading = ref(true);
const search = ref('');
const status = ref('');

let debounce;
watch([search, status], () => { clearTimeout(debounce); debounce = setTimeout(fetchAll, 350); });

function formatDate(iso) {
    return iso ? new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '–';
}

async function fetchAll() {
    loading.value = true;
    try {
        const { data } = await api.get('/admin/payments', { params: { search: search.value || undefined, status: status.value || undefined } });
        payments.value = data.data;
    } catch { /* ignore */ }
    finally { loading.value = false; }
}

onMounted(fetchAll);
</script>
