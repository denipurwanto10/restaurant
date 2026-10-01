import fs from 'node:fs';

const edits = [
    ['resources/js/pages/Checkout.vue', [
        ['<div v-if="!items.length"', '<div v-if="!cart.items.length"'],
        ['<div v-for="item in items"', '<div v-for="item in cart.items"'],
        ['{{ formatRupiah(subtotal) }}', '{{ formatRupiah(cart.subtotal) }}'],
        ['{{ formatRupiah(serviceCharge) }}', '{{ formatRupiah(cart.serviceCharge) }}'],
        ['import { authUser } from \'../stores/auth\';', "import { useAuth } from '../stores/auth';"],
        ['const { items, subtotal, serviceCharge, clearCart } = useCart();', 'const cart = useCart();\nconst auth = useAuth();'],
        ['const user = authUser();', ''],
        ["customer_name: user.value?.name || '',", "customer_name: auth.user?.name || '',"],
        ["customer_email: user.value?.email || '',", "customer_email: auth.user?.email || '',"],
        ["customer_phone: user.value?.phone || '',", "customer_phone: auth.user?.phone || '',"],
        ['const grandTotal = computed(() => Math.max(0, subtotal.value - discount.value + serviceCharge.value + (form.order_type === \'delivery\' ? deliveryFee : 0)));', 'const grandTotal = computed(() => Math.max(0, cart.subtotal - discount.value + cart.serviceCharge + (form.order_type === \'delivery\' ? deliveryFee : 0)));'],
        ['if (subtotal.value < promo.min_order) {', 'if (cart.subtotal < promo.min_order) {'],
        ['? Math.round(subtotal.value * promo.discount_value / 100)', '? Math.round(cart.subtotal * promo.discount_value / 100)'],
        ['items: items.value.map((i) => ({', 'items: cart.items.map((i) => ({'],
        ['clearCart();', 'cart.clearCart();'],
        ['if (!items.value.length) return;', 'if (!cart.items.length) return;'],
    ]],
    ['resources/js/pages/Orders.vue', [
        ['<div v-if="!user"', '<div v-if="!auth.user"'],
        ["import { authUser } from '../stores/auth';", "import { useAuth } from '../stores/auth';"],
        ['const user = authUser();', 'const auth = useAuth();'],
        ['if (!user.value) {', 'if (!auth.user) {'],
    ]],
    ['resources/js/pages/OrderDetail.vue', [
        ["import { authUser } from '../stores/auth';\n", ''],
        ['const user = authUser();\n', ''],
    ]],
    ['resources/js/router/index.js', [
        ["import { authUser } from '../stores/auth';", "import { useAuth } from '../stores/auth';"],
        ['const user = authUser().value;', 'const user = useAuth().user;'],
    ]],
    ['resources/js/App.vue', [
        ['const { fetchMe } = useAuth();', 'const auth = useAuth();'],
        ['await fetchMe();', 'await auth.fetchMe();'],
    ]],
    ['resources/js/pages/Home.vue', [
        ['const { addItem } = useCart();', 'const cart = useCart();'],
        ['addItem(menu, 1, []);', 'cart.addItem(menu, 1, []);'],
        ['quickAdd(data.data, 1);', 'cart.addItem(data.data, 1, []);'],
    ]],
    ['resources/js/pages/Menu.vue', [
        ['const { addItem } = useCart();', 'const cart = useCart();'],
        ['addItem(menu, 1, []);', 'cart.addItem(menu, 1, []);'],
    ]],
    ['resources/js/pages/MenuDetail.vue', [
        ['const { addItem } = useCart();', 'const cart = useCart();'],
        ['addItem(m, 1, []);', 'cart.addItem(m, 1, []);'],
        ['addItem(menu.value, qty.value, [...selectedAddons.value], note.value);', 'cart.addItem(menu.value, qty.value, [...selectedAddons.value], note.value);'],
    ]],
];

for (const [f, pairs] of edits) {
    let s = fs.readFileSync(f, 'utf8');
    let miss = [];
    for (const [a, b] of pairs) {
        if (!s.includes(a)) miss.push(a.slice(0, 60));
        s = s.split(a).join(b);
    }
    fs.writeFileSync(f, s);
    console.log((miss.length ? 'MISS ' + JSON.stringify(miss) + ' in ' : 'OK ') + f);
}
