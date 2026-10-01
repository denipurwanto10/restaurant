<template>
    <Transition name="drawer">
        <div v-if="open" class="fixed inset-0 z-50">
            <div class="absolute inset-0 bg-espresso-900/50 backdrop-blur-[2px]" @click="$emit('close')"></div>
            <aside class="drawer-panel absolute right-0 top-0 h-full w-full max-w-md bg-cream-50 shadow-2xl flex flex-col dark:bg-[#14100b]">
                <div class="flex items-center justify-between px-5 py-4 border-b border-cream-200 bg-white dark:border-white/10 dark:bg-[#211a12]">
                    <h3 class="font-serif text-xl font-bold flex items-center gap-2">
                        <ShoppingBag class="w-5 h-5" /> Your Cart
                        <span v-if="cart.count" class="text-sm font-sans font-semibold bg-cream-100 px-2.5 py-0.5 rounded-full dark:bg-[#2c2318]">{{ cart.count }}</span>
                    </h3>
                    <button @click="$emit('close')" class="p-2 rounded-full hover:bg-cream-100 transition dark:hover:bg-white/10" aria-label="Close cart">
                        <X class="w-5 h-5" />
                    </button>
                </div>

                <div v-if="!cart.items.length" class="flex-1 flex flex-col items-center justify-center gap-3 px-8 text-center">
                    <span class="w-20 h-20 rounded-full bg-cream-100 flex items-center justify-center dark:bg-[#2c2318]">
                        <ShoppingBasket class="w-9 h-9 text-espresso-500/60 dark:text-cream-200/70" />
                    </span>
                    <p class="font-serif text-xl font-bold">Your cart is empty.</p>
                    <p class="text-sm text-espresso-700/70 dark:text-cream-200">Explore our menu and discover something delicious.</p>
                    <RouterLink to="/menu" @click="$emit('close')" class="mt-2 font-semibold bg-espresso-900 text-cream-50 px-6 py-2.5 rounded-full hover:bg-espresso-700 dark:bg-gold-500 dark:text-espresso-900 dark:hover:bg-gold-400 transition">
                        Explore Menu
                    </RouterLink>
                </div>

                <div v-else class="flex-1 overflow-y-auto px-5 py-4 space-y-3.5">
                    <div v-for="item in cart.items" :key="item.key" class="bg-white rounded-xl border border-cream-200 p-3.5 flex gap-3 dark:bg-[#211a12] dark:border-white/10">
                        <div class="w-16 h-16 rounded-lg bg-cream-100 overflow-hidden shrink-0 dark:bg-[#2c2318]">
                            <img v-if="item.image" :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
                            <UtensilsCrossed v-else class="w-6 h-6 m-5 text-espresso-500/40 dark:text-cream-200/70" />
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="font-semibold text-sm truncate">{{ item.name }}</p>
                            <p v-if="item.addons?.length" class="text-xs text-espresso-700/60 dark:text-cream-200 truncate">+ {{ item.addons.map(a => a.name).join(', ') }}</p>
                            <p class="text-sm font-bold text-espresso-900 mt-0.5 dark:text-cream-100">{{ formatRupiah((item.price + item.addonsTotal) * item.quantity) }}</p>
                            <div class="flex items-center justify-between mt-2">
                                <div class="flex items-center gap-2.5 bg-cream-100 rounded-full px-1.5 py-1 dark:bg-[#2c2318]">
                                    <button @click="cart.decreaseQuantity(item.key)" class="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-cream-200 transition dark:bg-[#211a12] dark:hover:bg-white/10" aria-label="Decrease">
                                        <Minus class="w-3.5 h-3.5" />
                                    </button>
                                    <span class="text-sm font-bold w-5 text-center">{{ item.quantity }}</span>
                                    <button @click="cart.increaseQuantity(item.key)" class="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-cream-200 transition dark:bg-[#211a12] dark:hover:bg-white/10" aria-label="Increase">
                                        <Plus class="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <button @click="cart.removeItem(item.key)" class="p-1.5 text-red-600/70 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition dark:text-red-400" aria-label="Remove">
                                    <Trash2 class="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="cart.items.length" class="border-t border-cream-200 bg-white px-5 py-4 space-y-2 text-sm dark:border-white/10 dark:bg-[#211a12]">
                    <div class="flex justify-between text-espresso-700 dark:text-cream-200"><span>Subtotal</span><span class="font-semibold text-espresso-900 dark:text-cream-100">{{ formatRupiah(cart.subtotal) }}</span></div>
                    <div class="flex justify-between text-espresso-700 dark:text-cream-200"><span>Service charge (5%)</span><span class="font-semibold text-espresso-900 dark:text-cream-100">{{ formatRupiah(cart.serviceCharge) }}</span></div>
                    <div class="flex justify-between font-serif text-lg font-bold pt-1.5 border-t border-dashed border-cream-200 dark:border-white/10"><span>Total</span><span>{{ formatRupiah(cart.total) }}</span></div>
                    <RouterLink
                        to="/checkout"
                        @click="$emit('close')"
                        class="flex items-center justify-center gap-2 w-full font-semibold bg-espresso-900 text-cream-50 py-3 rounded-full hover:bg-espresso-700 dark:bg-gold-500 dark:text-espresso-900 dark:hover:bg-gold-400 transition mt-2"
                    >
                        Proceed to Checkout <ArrowRight class="w-4 h-4" />
                    </RouterLink>
                </div>
            </aside>
        </div>
    </Transition>
</template>

<script setup>
import { ArrowRight, Minus, Plus, ShoppingBag, ShoppingBasket, Trash2, UtensilsCrossed, X } from 'lucide-vue-next';
import { formatRupiah, useCart } from '../stores/cart';

defineProps({ open: { type: Boolean, default: false } });
defineEmits(['close']);

const cart = useCart();
</script>
