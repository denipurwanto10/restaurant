import { defineStore } from 'pinia';

const STORAGE_KEY = 'saveur_cart_v1';

function load() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
        return [];
    }
}

function keyOf(menuId, addonIds) {
    return `${menuId}:${[...(addonIds || [])].sort().join(',')}`;
}

export function formatRupiah(value) {
    return 'Rp ' + Number(value || 0).toLocaleString('id-ID');
}

export const useCart = defineStore('cart', {
    state: () => ({
        items: load(),
    }),
    getters: {
        count: (s) => s.items.reduce((n, i) => n + i.quantity, 0),
        subtotal: (s) => s.items.reduce((n, i) => n + (i.price + i.addonsTotal) * i.quantity, 0),
        serviceCharge() {
            return Math.round(this.subtotal * 0.05);
        },
        total() {
            return this.subtotal + this.serviceCharge;
        },
    },
    actions: {
        persist() {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
        },
        addItem(menu, quantity = 1, addonIds = [], note = '') {
            const addons = (menu.addons || []).filter((a) => addonIds.includes(a.id));
            const addonsTotal = addons.reduce((n, a) => n + a.price, 0);
            const key = keyOf(menu.id, addonIds);
            const existing = this.items.find((i) => i.key === key);
            if (existing) {
                existing.quantity = Math.min(50, existing.quantity + quantity);
            } else {
                this.items.push({
                    key,
                    menuId: menu.id,
                    name: menu.name,
                    slug: menu.slug,
                    price: menu.price,
                    image: menu.image,
                    quantity,
                    addonIds,
                    addons: addons.map((a) => ({ name: a.name, price: a.price })),
                    addonsTotal,
                    note,
                });
            }
            this.persist();
        },
        removeItem(key) {
            this.items = this.items.filter((i) => i.key !== key);
            this.persist();
        },
        increaseQuantity(key) {
            const item = this.items.find((i) => i.key === key);
            if (item) {
                item.quantity = Math.min(50, item.quantity + 1);
                this.persist();
            }
        },
        decreaseQuantity(key) {
            const item = this.items.find((i) => i.key === key);
            if (item) {
                item.quantity -= 1;
                if (item.quantity <= 0) {
                    this.removeItem(key);
                } else {
                    this.persist();
                }
            }
        },
        clearCart() {
            this.items = [];
            this.persist();
        },
        calculateTotal(deliveryFee = 0, discount = 0) {
            return Math.max(0, this.subtotal - discount + this.serviceCharge + deliveryFee);
        },
    },
});
