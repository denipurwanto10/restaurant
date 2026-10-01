<template>
    <div class="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div v-if="loading" class="space-y-3">
            <div class="skeleton h-10 rounded w-2/3"></div>
            <div class="skeleton h-72 rounded-3xl"></div>
        </div>

        <template v-else-if="payment">
            <!-- Status hero -->
            <div class="text-center">
                <span
                    class="inline-flex w-20 h-20 rounded-full items-center justify-center"
                    :class="statusStyle.badge"
                >
                    <component :is="statusStyle.icon" class="w-10 h-10" />
                </span>
                <h1 class="font-serif text-3xl sm:text-4xl font-bold mt-4">{{ statusStyle.title }}</h1>
                <p class="text-espresso-700/65 mt-1.5 dark:text-cream-200">{{ statusStyle.subtitle }}</p>
                <p class="text-xs mt-3 inline-flex items-center gap-1.5 bg-gold-500/10 text-gold-600 font-semibold px-3 py-1 rounded-full dark:text-gold-400">
                    <FlaskConical class="w-3.5 h-3.5" /> Demo Payment — No real money will be charged.
                </p>
            </div>

            <!-- Payment card -->
            <div class="bg-white rounded-3xl border border-cream-200 p-6 sm:p-8 mt-8 shadow-sm dark:bg-[#211a12] dark:border-white/10">
                <div class="flex justify-between items-start gap-4">
                    <div>
                        <p class="text-xs font-bold uppercase tracking-wider text-espresso-700/55 dark:text-cream-200">Invoice</p>
                        <p class="font-mono font-bold">{{ payment.invoice_number }}</p>
                    </div>
                    <span class="text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide" :class="statusStyle.pill">{{ payment.status }}</span>
                </div>

                <div class="mt-5 pt-5 border-t border-dashed border-cream-200 space-y-2 text-sm dark:border-white/10">
                    <div class="flex justify-between"><span class="text-espresso-700/70 dark:text-cream-200">Merchant</span><span class="font-semibold">SAVEUR RESTAURANT DEMO</span></div>
                    <div class="flex justify-between"><span class="text-espresso-700/70 dark:text-cream-200">Method</span><span class="font-semibold">{{ payment.payment_method_name }}</span></div>
                    <div v-if="payment.account_number" class="flex justify-between items-center">
                        <span class="text-espresso-700/70 dark:text-cream-200">Account</span>
                        <button @click="copy(payment.account_number)" class="font-mono font-bold flex items-center gap-1.5 hover:text-gold-600 transition dark:text-gold-400">
                            {{ payment.account_number }} <Copy class="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <div v-if="payment.account_name" class="flex justify-between"><span class="text-espresso-700/70 dark:text-cream-200">Account name</span><span class="font-semibold">{{ payment.account_name }}</span></div>
                    <div class="flex justify-between font-serif text-xl font-bold pt-2"><span>Total</span><span>{{ payment.amount_formatted }}</span></div>
                </div>

                <!-- QRIS dummy QR -->
                <div v-if="isQris && payment.status === 'pending'" class="mt-6 flex flex-col items-center">
                    <div class="bg-white border-2 border-espresso-900 rounded-2xl p-4 dark:bg-[#211a12] dark:border-gold-500">
                        <img :src="qrImage" alt="Dummy QRIS QR code" class="w-52 h-52" />
                    </div>
                    <p class="text-xs text-espresso-700/60 mt-2.5 dark:text-cream-200">Scan with any e-wallet or mobile banking (simulation)</p>
                    <p class="mt-3 text-sm font-semibold flex items-center gap-1.5">
                        <Timer class="w-4 h-4 text-red-600 dark:text-red-400" />
                        Expires in <span class="font-mono text-red-600 dark:text-red-400">{{ countdown }}</span>
                    </p>
                </div>

                <!-- Simulate buttons -->
                <div v-if="payment.status === 'pending'" class="mt-6 space-y-2.5">
                    <button
                        @click="simulate('paid')"
                        :disabled="simulating"
                        class="w-full inline-flex items-center justify-center gap-2 bg-espresso-900 text-cream-50 font-semibold py-3.5 rounded-full hover:bg-espresso-700 dark:bg-gold-500 dark:text-espresso-900 dark:hover:bg-gold-400 transition disabled:opacity-50 active:scale-[0.98]"
                    >
                        <LoaderCircle v-if="simulating" class="w-5 h-5 animate-spin" />
                        <BadgeCheck v-else class="w-5 h-5" />
                        Simulate Payment
                    </button>
                    <button @click="simulate('failed')" :disabled="simulating" class="w-full text-sm font-medium text-espresso-700/60 hover:text-red-600 transition py-1 dark:text-cream-200">
                        Simulate failed payment
                    </button>
                </div>

                <div v-else class="mt-6">
                    <RouterLink
                        :to="`/orders/${orderNumber}`"
                        class="w-full inline-flex items-center justify-center gap-2 bg-espresso-900 text-cream-50 font-semibold py-3.5 rounded-full hover:bg-espresso-700 dark:bg-gold-500 dark:text-espresso-900 dark:hover:bg-gold-400 transition"
                    >
                        Track My Order <ArrowRight class="w-4 h-4" />
                    </RouterLink>
                </div>
            </div>

            <div class="flex justify-center gap-3 mt-6 text-sm">
                <RouterLink to="/menu" class="font-medium text-espresso-700/70 hover:text-espresso-900 dark:text-cream-200 dark:hover:text-gold-400">Back to menu</RouterLink>
                <span class="text-cream-200">·</span>
                <RouterLink to="/orders" class="font-medium text-espresso-700/70 hover:text-espresso-900 dark:text-cream-200 dark:hover:text-gold-400">My orders</RouterLink>
            </div>
        </template>

        <div v-else class="text-center py-20">
            <p class="font-serif text-2xl font-bold">Payment not found.</p>
            <RouterLink to="/menu" class="text-gold-600 font-semibold dark:text-gold-400">Back to menu →</RouterLink>
        </div>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowRight, BadgeCheck, CircleCheck, CircleX, Copy, FlaskConical, Hourglass, LoaderCircle, Timer } from 'lucide-vue-next';
import api, { errorMessage } from '../services/api';
import { useToast } from '../stores/toast';

const route = useRoute();
const router = useRouter();
const { success, error, info } = useToast();

const payment = ref(null);
const orderNumber = ref('');
const loading = ref(true);
const simulating = ref(false);
const secondsLeft = ref(0);
let timer = null;

// Static dummy QR (encodes demo text, no real payment data)
const qrImage = computed(() => {
    const text = encodeURIComponent(`SAVEUR-DEMO|${payment.value?.invoice_number}|${payment.value?.amount}`);
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${text}`;
});

const isQris = computed(() => payment.value?.payment_method_code === 'qris');

const statusStyle = computed(() => {
    switch (payment.value?.status) {
        case 'paid':
            return { icon: CircleCheck, badge: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400', pill: 'bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-400', title: 'Payment Successful', subtitle: 'Thank you! Your order is now being prepared.' };
        case 'failed':
            return { icon: CircleX, badge: 'bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400', pill: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400', title: 'Payment Failed', subtitle: 'The simulated payment did not go through. Try again.' };
        case 'expired':
            return { icon: Hourglass, badge: 'bg-cream-200 text-espresso-700 dark:bg-white/10 dark:text-cream-200', pill: 'bg-cream-200 text-espresso-800 dark:bg-white/10 dark:text-cream-200', title: 'Payment Expired', subtitle: 'This invoice has expired. Please place a new order.' };
        default:
            return { icon: Hourglass, badge: 'bg-gold-500/15 text-gold-600 dark:text-gold-400', pill: 'bg-gold-500/15 text-gold-600 dark:text-gold-400', title: 'Payment Pending', subtitle: 'Complete your demo payment below to confirm the order.' };
    }
});

const countdown = computed(() => {
    const m = Math.floor(secondsLeft.value / 60);
    const s = secondsLeft.value % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
});

function copy(text) {
    navigator.clipboard?.writeText(text);
    info('Copied to clipboard.');
}

async function load() {
    loading.value = true;
    try {
        // Find payment via guest lookup: fetch order by invoice through orders lookup is not exposed,
        // so we resolve payment id from the invoice route param by trying the show endpoint list.
        // Simpler: backend exposes /payments/{payment}; the invoice number maps via order lookup.
        const { data } = await api.get(`/orders/lookup-by-invoice/${route.params.invoice}`);
        payment.value = data.payment;
        orderNumber.value = data.order_number;
        if (payment.value?.expires_at) {
            secondsLeft.value = Math.max(0, Math.floor((new Date(payment.value.expires_at) - Date.now()) / 1000));
            timer = setInterval(() => {
                if (secondsLeft.value > 0) secondsLeft.value -= 1;
            }, 1000);
        }
        document.title = `Payment ${payment.value.invoice_number} — Saveur`;
    } catch {
        error('Payment not found.');
    } finally {
        loading.value = false;
    }
}

async function simulate(result) {
    simulating.value = true;
    try {
        const { data } = await api.post(`/payments/by-invoice/${payment.value.invoice_number}/simulate`, { result });
        payment.value = data.payment;
        if (result === 'paid') {
            success('Demo payment successful. No real money was charged.');
            setTimeout(() => router.push(`/orders/${orderNumber.value}`), 900);
        } else {
            error('Demo payment marked as failed.');
        }
    } catch (err) {
        error(errorMessage(err));
    } finally {
        simulating.value = false;
    }
}

onMounted(load);
onBeforeUnmount(() => clearInterval(timer));
</script>
