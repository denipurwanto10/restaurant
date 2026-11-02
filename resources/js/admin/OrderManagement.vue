<template>
    <div v-reveal.stagger class="space-y-5">
        <div class="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div class="relative flex-1 max-w-md">
                <Search class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-500/50 dark:text-cream-200/70" />
                <input v-model="search" type="text" placeholder="Search orders…" class="w-full pl-10 pr-4 py-2.5 rounded-[0.875rem] border border-cream-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 dark:border-white/10 dark:bg-[#1b1510] dark:focus:ring-gold-400/40 shadow-soft" />
            </div>
            <BaseSelect v-model="status" :options="[{ value: '', label: 'All statuses' }, ...statuses]" class="sm:w-52" capitalize label="Order status" />
            <BaseSelect v-model="paymentStatus" :options="[{ value: '', label: 'All payments' }, 'pending', 'paid', 'failed', 'expired']" class="sm:w-52" capitalize label="Payment" />
        </div>

        <div class="bg-white rounded-[1.25rem] border border-cream-200 overflow-hidden dark:bg-[#1b1510] dark:border-white/10 shadow-soft">
            <div class="overflow-x-auto">
                <table class="w-full text-sm min-w-[820px]">
                    <thead><tr class="text-left text-xs uppercase tracking-wide text-espresso-700/55 bg-cream-50 dark:bg-[#110d09] dark:text-cream-200">
                        <th class="px-4 py-3">Order</th><th class="px-4 py-3">Customer</th><th class="px-4 py-3">Type</th><th class="px-4 py-3">Total</th><th class="px-4 py-3">Status</th><th class="px-4 py-3">Payment</th><th class="px-4 py-3">Date</th>
                    </tr></thead>
                    <tbody>
                        <tr v-for="o in orders" :key="o.id" class="border-t border-cream-100 hover:bg-cream-50 cursor-pointer dark:border-white/10 dark:hover:bg-white/5" @click="openOrder(o)">
                            <td class="px-4 py-3 font-mono font-bold">{{ o.order_number }}</td>
                            <td class="px-4 py-3">{{ o.customer_name }}</td>
                            <td class="px-4 py-3 capitalize">{{ o.order_type.replace('_', ' ') }}</td>
                            <td class="px-4 py-3 font-semibold">{{ o.total_formatted }}</td>
                            <td class="px-4 py-3"><StatusPill :value="o.status" /></td>
                            <td class="px-4 py-3"><StatusPill :value="o.payment_status" /></td>
                            <td class="px-4 py-3 text-espresso-700/60 dark:text-cream-200">{{ formatDate(o.created_at) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p v-if="!orders.length && !loading" class="text-center text-sm text-espresso-700/60 py-10 dark:text-cream-200">No orders found.</p>
        </div>

        <!-- Detail drawer -->
        <Transition name="drawer">
            <div v-if="selected" class="fixed inset-0 z-50">
                <div class="absolute inset-0 bg-espresso-900/50" @click="selected = null"></div>
                <aside class="drawer-panel absolute right-0 top-0 h-full w-full max-w-lg bg-[#f6f1e7] shadow-2xl overflow-y-auto p-5 sm:p-7 dark:bg-[#110d09]">
                    <div class="flex items-start justify-between">
                        <div>
                            <p class="font-mono font-bold text-lg">{{ selected.order_number }}</p>
                            <p class="text-sm text-espresso-700/60 dark:text-cream-200">{{ selected.customer_name }} · {{ selected.customer_phone }}</p>
                        </div>
                        <button @click="selected = null" class="p-2 rounded-full hover:bg-cream-100 dark:hover:bg-white/10"><X class="w-5 h-5" /></button>
                    </div>
                    <div class="bg-white rounded-[1.25rem] border border-cream-200 p-4 mt-5 text-sm space-y-2 dark:bg-[#1b1510] dark:border-white/10 shadow-soft">
                        <div v-for="i in selected.items" :key="i.id" class="flex justify-between gap-2">
                            <span>{{ i.quantity }}× {{ i.menu_name }}</span>
                            <span class="font-semibold">{{ formatRupiah(i.subtotal) }}</span>
                        </div>
                        <div class="flex justify-between font-bold pt-2 border-t border-dashed border-cream-200 dark:border-white/10"><span>Total</span><span>{{ selected.total_formatted }}</span></div>
                    </div>
                    <div class="mt-4">
                        <label class="text-sm font-bold">Update status</label>
                        <div class="flex flex-wrap gap-2 mt-2">
                            <button
                                v-for="s in statuses"
                                :key="s"
                                @click="updateStatus(s)"
                                class="px-3.5 py-1.5 rounded-full text-xs font-bold border transition"
                                :class="selected.status === s ? 'bg-espresso-900 text-cream-50 border-espresso-900 dark:bg-gold-500 dark:text-espresso-900' : 'bg-white border-cream-200 hover:border-espresso-900 dark:bg-[#1b1510] dark:border-white/10 dark:hover:border-gold-400'"
                            >{{ s }}</button>
                        </div>
                    </div>
                </aside>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import BaseSelect from '../components/BaseSelect.vue';
import { onMounted, ref, watch } from 'vue';
import { Search, X } from 'lucide-vue-next';
import api from '../services/api';
import StatusPill from '../components/StatusPill.vue';
import { formatRupiah } from '../stores/cart';
import { useToast } from '../stores/toast';

const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
const orders = ref([]);
const loading = ref(true);
const search = ref('');
const status = ref('');
const paymentStatus = ref('');
const selected = ref(null);
const { success, error } = useToast();

let debounce;
watch([search, status, paymentStatus], () => {
    clearTimeout(debounce);
    debounce = setTimeout(fetchOrders, 350);
});

function formatDate(iso) {
    return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

async function fetchOrders() {
    loading.value = true;
    try {
        const { data } = await api.get('/admin/orders', { params: { search: search.value || undefined, status: status.value || undefined, payment_status: paymentStatus.value || undefined } });
        orders.value = data.data;
    } catch { error('Failed to load orders.'); }
    finally { loading.value = false; }
}

async function openOrder(o) {
    try {
        const { data } = await api.get(`/admin/orders/${o.id}`);
        selected.value = data.data;
    } catch { error('Failed to load order detail.'); }
}

async function updateStatus(s) {
    try {
        const { data } = await api.put(`/admin/orders/${selected.value.id}/status`, { status: s });
        selected.value = data.order;
        const idx = orders.value.findIndex((o) => o.id === data.order.id);
        if (idx >= 0) orders.value[idx] = { ...orders.value[idx], status: s };
        success(`Order status → ${s}.`);
    } catch { error('Failed to update status.'); }
}

onMounted(fetchOrders);
</script>
