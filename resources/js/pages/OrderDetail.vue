<template>
    <div class="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <RouterLink to="/orders" class="inline-flex items-center gap-1.5 text-sm font-medium text-espresso-700/70 dark:text-cream-200 hover:text-espresso-900 dark:hover:text-gold-400 transition mb-6">
            <ArrowLeft class="w-4 h-4" /> All orders
        </RouterLink>

        <div v-if="loading" class="space-y-3">
            <div class="skeleton h-10 rounded w-1/2"></div>
            <div class="skeleton h-80 rounded-3xl"></div>
        </div>

        <template v-else-if="order">
            <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h1 class="font-serif text-3xl sm:text-4xl font-bold font-mono">{{ order.order_number }}</h1>
                    <p class="text-sm text-espresso-700/60 mt-1 dark:text-cream-200">{{ formatDate(order.created_at) }} · {{ typeLabel }} · {{ order.branch?.name }}</p>
                </div>
                <div class="flex gap-2"><StatusPill :value="order.status" /><StatusPill :value="order.payment_status" /></div>
            </div>

            <!-- Timeline -->
            <ol class="mt-8 relative">
                <li v-for="(s, i) in steps" :key="s.key" class="flex gap-4 pb-7 last:pb-0 relative">
                    <div v-if="i < steps.length - 1" class="absolute left-[19px] top-10 bottom-0 w-0.5" :class="s.done ? 'bg-green-600' : 'bg-cream-200 dark:bg-[#3e3222]'"></div>
                    <span
                        class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition"
                        :class="s.done ? 'bg-green-600 border-green-600 text-white' : s.current ? 'border-gold-500 bg-gold-500/10 text-gold-600' : 'border-cream-200 bg-white text-espresso-500/40 dark:border-white/10 dark:bg-[#211a12]'"
                    >
                        <CircleCheck v-if="s.done" class="w-5 h-5" />
                        <component v-else :is="s.icon" class="w-5 h-5" />
                    </span>
                    <div class="pt-1">
                        <p class="font-bold" :class="s.done || s.current ? '' : 'text-espresso-700/40'">{{ s.label }}</p>
                        <p class="text-sm text-espresso-700/60 dark:text-cream-200">{{ s.desc }}</p>
                    </div>
                </li>
            </ol>

            <!-- Items -->
            <div class="bg-white rounded-2xl border border-cream-200 p-5 sm:p-6 mt-8 dark:bg-[#211a12] dark:border-white/10">
                <h2 class="font-serif text-xl font-bold">Items</h2>
                <div class="mt-3 space-y-2.5 text-sm">
                    <div v-for="item in order.items" :key="item.id" class="flex justify-between gap-3">
                        <span><b>{{ item.quantity }}×</b> {{ item.menu_name }}
                            <span v-if="item.addons?.length" class="text-espresso-700/55 dark:text-cream-200">(+{{ item.addons.map(a => a.name).join(', ') }})</span>
                        </span>
                        <span class="font-semibold shrink-0">{{ formatRupiah(item.subtotal) }}</span>
                    </div>
                </div>
                <dl class="mt-4 pt-4 border-t border-dashed border-cream-200 space-y-1.5 text-sm dark:border-white/10">
                    <div class="flex justify-between"><dt class="text-espresso-700 dark:text-cream-200">Subtotal</dt><dd class="font-semibold">{{ formatRupiah(order.subtotal) }}</dd></div>
                    <div v-if="order.discount" class="flex justify-between text-green-700 dark:text-green-400"><dt>Discount</dt><dd class="font-semibold">−{{ formatRupiah(order.discount) }}</dd></div>
                    <div class="flex justify-between"><dt class="text-espresso-700 dark:text-cream-200">Service charge</dt><dd class="font-semibold">{{ formatRupiah(order.service_charge) }}</dd></div>
                    <div v-if="order.delivery_fee" class="flex justify-between"><dt class="text-espresso-700 dark:text-cream-200">Delivery fee</dt><dd class="font-semibold">{{ formatRupiah(order.delivery_fee) }}</dd></div>
                    <div class="flex justify-between font-serif text-xl font-bold pt-1"><dt>Total</dt><dd>{{ order.total_formatted }}</dd></div>
                </dl>
                <div v-if="order.payment_status === 'pending' && order.payment" class="mt-4">
                    <RouterLink :to="`/payment/${order.payment.invoice_number}`" class="w-full inline-flex items-center justify-center gap-2 bg-espresso-900 text-cream-50 font-semibold py-3 rounded-full hover:bg-espresso-700 dark:bg-gold-500 dark:text-espresso-900 dark:hover:bg-gold-400 transition">
                        Pay Now <ArrowRight class="w-4 h-4" />
                    </RouterLink>
                </div>
            </div>
        </template>

        <div v-else class="text-center py-20">
            <p class="font-serif text-2xl font-bold">Order not found.</p>
            <RouterLink to="/orders" class="text-gold-600 font-semibold dark:text-gold-400">View my orders →</RouterLink>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import {
    ArrowLeft, ArrowRight, CircleCheck, ClipboardList, CookingPot, CreditCard, PartyPopper, ReceiptText,
} from 'lucide-vue-next';
import api from '../services/api';
import StatusPill from '../components/StatusPill.vue';
import { formatRupiah } from '../stores/cart';

const route = useRoute();
const order = ref(null);
const loading = ref(true);

const typeLabel = computed(() => ({ dine_in: 'Dine In', take_away: 'Take Away', delivery: 'Delivery' }[order.value?.order_type] ?? ''));

const stepOrder = ['pending', 'confirmed', 'preparing', 'ready', 'completed'];
const steps = computed(() => {
    if (!order.value) return [];
    if (order.value.status === 'cancelled') {
        return [{ key: 'cancelled', label: 'Order Cancelled', desc: 'This order was cancelled.', icon: ClipboardList, done: true, current: false }];
    }
    const idx = stepOrder.indexOf(order.value.status);
    const paid = order.value.payment_status === 'paid';
    return [
        { key: 'pending', label: 'Order Placed', desc: 'We received your order.', icon: ClipboardList },
        { key: 'confirmed', label: 'Payment Confirmed', desc: paid ? 'Demo payment confirmed.' : 'Waiting for payment.', icon: CreditCard },
        { key: 'preparing', label: 'Preparing', desc: 'Our chefs are at work.', icon: CookingPot },
        { key: 'ready', label: 'Ready', desc: 'Your food is ready to serve.', icon: ReceiptText },
        { key: 'completed', label: 'Completed', desc: 'Enjoy your meal!', icon: PartyPopper },
    ].map((s, i) => ({
        ...s,
        done: i < idx || (i === 1 && paid) || (i === 0),
        current: i === Math.max(idx, 0),
    }));
});

function formatDate(iso) {
    return new Date(iso).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

onMounted(async () => {
    try {
        const { data } = await api.get(`/orders/lookup/${route.params.number}`);
        order.value = data.data ?? data.order ?? data;
        document.title = `Order ${order.value.order_number} — Saveur`;
    } catch { /* not found */ }
    finally {
        loading.value = false;
    }
});
</script>
