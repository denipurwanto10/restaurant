<template>
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 class="font-serif text-4xl sm:text-5xl font-bold">Checkout</h1>
        <p class="text-espresso-700/65 mt-1.5 dark:text-cream-200">Almost there — tell us where to send the goodness.</p>

        <div v-if="!cart.items.length" class="text-center py-16 bg-white rounded-3xl border border-cream-200 mt-8 dark:bg-[#211a12] dark:border-white/10">
            <ShoppingBasket class="w-12 h-12 mx-auto text-espresso-500/30 dark:text-cream-200/70" />
            <p class="font-serif text-2xl font-bold mt-4">Your cart is empty.</p>
            <RouterLink to="/menu" class="inline-block mt-3 font-semibold bg-espresso-900 dark:bg-gold-500 text-cream-50 dark:text-espresso-900 px-6 py-2.5 rounded-full">Explore our menu</RouterLink>
        </div>

        <div v-else class="grid lg:grid-cols-[1fr_380px] gap-6 mt-8 items-start">
            <div class="space-y-5">
                <!-- Customer info -->
                <section class="bg-white rounded-2xl border border-cream-200 p-5 sm:p-6 dark:bg-[#211a12] dark:border-white/10">
                    <h2 class="font-serif text-xl font-bold flex items-center gap-2"><CircleUserRound class="w-5 h-5 text-gold-600 dark:text-gold-400" /> Customer Information</h2>
                    <div class="grid sm:grid-cols-2 gap-3.5 mt-4">
                        <div>
                            <label class="text-sm font-medium">Full name *</label>
                            <input v-model="form.customer_name" type="text" class="mt-1 w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 dark:focus:ring-gold-400/40" :class="inputClass('customer_name')" placeholder="Jane Doe" />
                            <FieldError :errors="errors" field="customer_name" />
                        </div>
                        <div>
                            <label class="text-sm font-medium">Phone *</label>
                            <input v-model="form.customer_phone" type="tel" class="mt-1 w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 dark:focus:ring-gold-400/40" :class="inputClass('customer_phone')" placeholder="0812…" />
                            <FieldError :errors="errors" field="customer_phone" />
                        </div>
                        <div class="sm:col-span-2">
                            <label class="text-sm font-medium">Email *</label>
                            <input v-model="form.customer_email" type="email" class="mt-1 w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 dark:focus:ring-gold-400/40" :class="inputClass('customer_email')" placeholder="jane@email.com" />
                            <FieldError :errors="errors" field="customer_email" />
                        </div>
                    </div>
                </section>

                <!-- Order type -->
                <section class="bg-white rounded-2xl border border-cream-200 p-5 sm:p-6 dark:bg-[#211a12] dark:border-white/10">
                    <h2 class="font-serif text-xl font-bold flex items-center gap-2"><ConciergeBell class="w-5 h-5 text-gold-600 dark:text-gold-400" /> Order Type</h2>
                    <div class="grid grid-cols-3 gap-2 sm:gap-2.5 mt-4">
                        <button
                            v-for="t in orderTypes"
                            :key="t.value"
                            @click="form.order_type = t.value"
                            class="rounded-xl border-2 px-2 py-3.5 text-center transition"
                            :class="form.order_type === t.value ? 'border-espresso-900 dark:border-gold-500 bg-espresso-900 dark:bg-gold-500 text-cream-50 dark:text-espresso-900' : 'border-cream-200 hover:border-espresso-900/40 dark:border-white/10 dark:hover:border-gold-400'"
                        >
                            <component :is="t.icon" class="w-5 h-5 mx-auto" />
                            <p class="text-[11px] sm:text-[13px] font-bold mt-1.5 leading-tight">{{ t.label }}</p>
                        </button>
                    </div>

                    <div v-if="form.order_type !== 'delivery'" class="grid sm:grid-cols-2 gap-3.5 mt-4">
                        <div>
                            <label class="text-sm font-medium">Branch *</label>
                            <select v-model="form.branch_id" class="mt-1 w-full px-4 py-2.5 rounded-xl border border-cream-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 dark:border-white/10 dark:bg-[#211a12] dark:focus:ring-gold-400/40">
                                <option :value="null" disabled>Select branch</option>
                                <option v-for="b in branches" :key="b.id" :value="b.id">{{ b.name }}</option>
                            </select>
                            <FieldError :errors="errors" field="branch_id" />
                        </div>
                        <div v-if="form.order_type === 'dine_in'">
                            <label class="text-sm font-medium">Table number</label>
                            <input v-model="form.table_number" type="text" placeholder="e.g. A-12" class="mt-1 w-full px-4 py-2.5 rounded-xl border border-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 dark:border-white/10 dark:focus:ring-gold-400/40" />
                        </div>
                    </div>

                    <div v-else class="grid sm:grid-cols-2 gap-3.5 mt-4">
                        <div class="sm:col-span-2">
                            <label class="text-sm font-medium">Delivery address *</label>
                            <textarea v-model="form.delivery_address" rows="2" class="mt-1 w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 dark:focus:ring-gold-400/40" :class="inputClass('delivery_address')" placeholder="Street, building, landmark…"></textarea>
                            <FieldError :errors="errors" field="delivery_address" />
                        </div>
                        <div>
                            <label class="text-sm font-medium">City *</label>
                            <input v-model="form.delivery_city" type="text" class="mt-1 w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 dark:focus:ring-gold-400/40" :class="inputClass('delivery_city')" placeholder="Jakarta Selatan" />
                            <FieldError :errors="errors" field="delivery_city" />
                        </div>
                        <div>
                            <label class="text-sm font-medium">Postal code</label>
                            <input v-model="form.delivery_postal_code" type="text" class="mt-1 w-full px-4 py-2.5 rounded-xl border border-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 dark:border-white/10 dark:focus:ring-gold-400/40" placeholder="12190" />
                        </div>
                        <div>
                            <label class="text-sm font-medium">Branch (preparation)</label>
                            <select v-model="form.branch_id" class="mt-1 w-full px-4 py-2.5 rounded-xl border border-cream-200 text-sm bg-white dark:border-white/10 dark:bg-[#211a12]">
                                <option v-for="b in branches" :key="b.id" :value="b.id">{{ b.name }}</option>
                            </select>
                        </div>
                        <div>
                            <label class="text-sm font-medium">Delivery note</label>
                            <input v-model="form.delivery_note" type="text" class="mt-1 w-full px-4 py-2.5 rounded-xl border border-cream-200 text-sm dark:border-white/10" placeholder="Ring twice…" />
                        </div>
                    </div>
                </section>

                <!-- Payment method -->
                <section class="bg-white rounded-2xl border border-cream-200 p-5 sm:p-6 dark:bg-[#211a12] dark:border-white/10">
                    <h2 class="font-serif text-xl font-bold flex items-center gap-2"><Wallet class="w-5 h-5 text-gold-600 dark:text-gold-400" /> Payment Method</h2>
                    <p class="text-xs mt-1.5 inline-flex items-center gap-1.5 bg-gold-500/10 text-gold-600 font-semibold px-3 py-1 rounded-full dark:text-gold-400"><FlaskConical class="w-3.5 h-3.5" /> Demo Payment — No real money will be charged.</p>
                    <div class="grid sm:grid-cols-2 gap-2.5 mt-4">
                        <button
                            v-for="m in paymentMethods"
                            :key="m.code"
                            @click="form.payment_method = m.code"
                            class="rounded-xl border-2 p-4 text-left transition"
                            :class="form.payment_method === m.code ? 'border-espresso-900 dark:border-gold-500 bg-cream-50 dark:bg-[#14100b]' : 'border-cream-200 hover:border-espresso-900/40 dark:border-white/10 dark:hover:border-gold-400'"
                        >
                            <p class="font-bold text-[15px] flex items-center gap-2">
                                <QrCode v-if="m.type === 'qris'" class="w-5 h-5" />
                                <Landmark v-else class="w-5 h-5" />
                                {{ m.name }}
                            </p>
                            <p class="text-xs text-espresso-700/60 mt-1 dark:text-cream-200">{{ m.type === 'qris' ? 'Scan QR with any e-wallet' : `Transfer to ${m.account_number}` }}</p>
                        </button>
                    </div>
                    <FieldError :errors="errors" field="payment_method" />
                </section>
            </div>

            <!-- Summary -->
            <aside class="bg-white rounded-2xl border border-cream-200 p-5 sm:p-6 lg:sticky lg:top-24 dark:bg-[#211a12] dark:border-white/10">
                <h2 class="font-serif text-xl font-bold">Order Summary</h2>
                <div class="mt-4 space-y-3 max-h-64 overflow-y-auto pr-1">
                    <div v-for="item in cart.items" :key="item.key" class="flex gap-3 text-sm">
                        <span class="font-bold text-espresso-700 bg-cream-100 rounded-lg w-7 h-7 flex items-center justify-center shrink-0 dark:text-cream-200 dark:bg-[#2c2318]">{{ item.quantity }}×</span>
                        <div class="flex-1 min-w-0">
                            <p class="font-semibold truncate">{{ item.name }}</p>
                            <p v-if="item.addons?.length" class="text-xs text-espresso-700/55 truncate dark:text-cream-200">+ {{ item.addons.map(a => a.name).join(', ') }}</p>
                        </div>
                        <span class="font-semibold shrink-0">{{ formatRupiah((item.price + item.addonsTotal) * item.quantity) }}</span>
                    </div>
                </div>

                <div class="mt-4 flex gap-2">
                    <input v-model="promoCode" type="text" placeholder="Promo code (e.g. WELCOME15)" class="flex-1 min-w-0 px-3.5 py-2 rounded-xl border border-cream-200 text-sm uppercase dark:border-white/10" />
                    <button @click="applyPromo" :disabled="promoLoading" class="px-4 py-2 rounded-xl bg-cream-100 text-sm font-bold hover:bg-cream-200 transition disabled:opacity-50 dark:bg-[#2c2318] dark:hover:bg-white/10">
                        {{ promoLoading ? '…' : 'Apply' }}
                    </button>
                </div>
                <p v-if="promoApplied" class="text-xs text-green-700 font-semibold mt-1.5 flex items-center gap-1 dark:text-green-400"><BadgeCheck class="w-3.5 h-3.5" /> {{ promoApplied.title }} applied (−{{ formatRupiah(discount) }})</p>

                <dl class="mt-4 pt-4 border-t border-dashed border-cream-200 space-y-1.5 text-sm dark:border-white/10">
                    <div class="flex justify-between"><dt class="text-espresso-700 dark:text-cream-200">Subtotal</dt><dd class="font-semibold">{{ formatRupiah(cart.subtotal) }}</dd></div>
                    <div v-if="discount" class="flex justify-between text-green-700 dark:text-green-400"><dt>Discount</dt><dd class="font-semibold">−{{ formatRupiah(discount) }}</dd></div>
                    <div class="flex justify-between"><dt class="text-espresso-700 dark:text-cream-200">Service charge (5%)</dt><dd class="font-semibold">{{ formatRupiah(cart.serviceCharge) }}</dd></div>
                    <div v-if="form.order_type === 'delivery'" class="flex justify-between"><dt class="text-espresso-700 dark:text-cream-200">Delivery fee</dt><dd class="font-semibold">{{ formatRupiah(deliveryFee) }}</dd></div>
                    <div class="flex justify-between font-serif text-xl font-bold pt-2"><dt>Total</dt><dd>{{ formatRupiah(grandTotal) }}</dd></div>
                </dl>

                <button
                    @click="placeOrder"
                    :disabled="submitting || !form.payment_method"
                    class="w-full mt-4 inline-flex items-center justify-center gap-2 bg-espresso-900 text-cream-50 font-semibold py-3.5 rounded-full hover:bg-espresso-700 dark:bg-gold-500 dark:text-espresso-900 dark:hover:bg-gold-400 transition disabled:opacity-50 active:scale-[0.98]"
                >
                    <LoaderCircle v-if="submitting" class="w-5 h-5 animate-spin" />
                    <template v-else>Place Order · {{ formatRupiah(grandTotal) }}</template>
                </button>
            </aside>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
    BadgeCheck, Bike, CircleUserRound, ConciergeBell, FlaskConical, Landmark,
    LoaderCircle, QrCode, ShoppingBag, ShoppingBasket, Wallet,
} from 'lucide-vue-next';
import api, { errorMessage, validationErrors } from '../services/api';
import { formatRupiah, useCart } from '../stores/cart';
import { useAuth } from '../stores/auth';
import { useToast } from '../stores/toast';
import FieldError from '../components/FieldError.vue';

const router = useRouter();
const cart = useCart();
const auth = useAuth();
const { success, error } = useToast();

const orderTypes = [
    { value: 'dine_in', label: 'Dine In', icon: ConciergeBell },
    { value: 'take_away', label: 'Take Away', icon: ShoppingBag },
    { value: 'delivery', label: 'Delivery', icon: Bike },
];

const branches = ref([]);
const paymentMethods = ref([]);
const errors = ref({});
const submitting = ref(false);
const promoCode = ref('');
const promoApplied = ref(null);
const promoLoading = ref(false);
const discount = ref(0);
const deliveryFee = 15000;


const form = reactive({
    customer_name: auth.user?.name || '',
    customer_email: auth.user?.email || '',
    customer_phone: auth.user?.phone || '',
    order_type: 'dine_in',
    branch_id: null,
    table_number: '',
    delivery_address: '',
    delivery_city: '',
    delivery_postal_code: '',
    delivery_note: '',
    payment_method: 'qris',
});

const grandTotal = computed(() => Math.max(0, cart.subtotal - discount.value + cart.serviceCharge + (form.order_type === 'delivery' ? deliveryFee : 0)));

function inputClass(field) {
    return errors.value[field] ? 'border-red-400' : 'border-cream-200 dark:border-white/10';
}

async function applyPromo() {
    if (!promoCode.value.trim()) return;
    promoLoading.value = true;
    try {
        const { data } = await api.get('/promos');
        const promo = data.data.find((p) => p.code === promoCode.value.trim().toUpperCase());
        if (!promo) {
            error('Promo code not found.');
            return;
        }
        if (cart.subtotal < promo.min_order) {
            error(`Minimum order for this promo is ${formatRupiah(promo.min_order)}.`);
            return;
        }
        let d = promo.discount_type === 'percent'
            ? Math.round(cart.subtotal * promo.discount_value / 100)
            : promo.discount_value;
        if (promo.max_discount) {
            d = Math.min(d, promo.max_discount);
        }
        promoApplied.value = promo;
        form.promo_code = promo.code;
        discount.value = d;
        success(`Promo ${promo.code} applied.`);
    } catch {
        error('Could not validate promo.');
    } finally {
        promoLoading.value = false;
    }
}

async function placeOrder() {
    errors.value = {};
    if (!form.branch_id) {
        error('Please select a branch.');
        return;
    }
    submitting.value = true;
    try {
        const payload = {
            ...form,
            branch_id: form.branch_id,
            promo_code: promoApplied.value?.code,
            items: cart.items.map((i) => ({
                menu_id: i.menuId,
                quantity: i.quantity,
                addon_ids: i.addonIds,
                note: i.note || undefined,
            })),
        };
        const { data } = await api.post('/orders', payload);
        cart.clearCart();
        success('Order created. Complete your demo payment.');
        router.push(`/payment/${data.order.payment.invoice_number}`);
    } catch (err) {
        errors.value = validationErrors(err);
        error(errorMessage(err, 'Failed to place order. Please check the form.'));
    } finally {
        submitting.value = false;
    }
}

onMounted(async () => {
    document.title = 'Checkout — Saveur Restaurant';
    if (!cart.items.length) return;
    try {
        const [b, pm] = await Promise.all([api.get('/branches'), api.get('/payment-methods')]);
        branches.value = b.data.data;
        paymentMethods.value = pm.data;
        form.branch_id = branches.value[0]?.id ?? null;
        if (!paymentMethods.value.find((m) => m.code === 'qris')) {
            form.payment_method = paymentMethods.value[0]?.code;
        }
    } catch {
        error('Failed to load checkout data.');
    }
});
</script>
