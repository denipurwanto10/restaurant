import fs from 'node:fs';

const edits = [
    ['resources/js/components/Navbar.vue', [
        ['<RouterLink v-if="user?.role', '<RouterLink v-if="auth.user?.role'],
        ['<template v-if="user">', '<template v-if="auth.user">'],
        ['{{ user.name.charAt', '{{ auth.user.name.charAt'],
        ['<RouterLink v-if="user" to="/orders"', '<RouterLink v-if="auth.user" to="/orders"'],
        ['<button v-if="user" @click="doLogout"', '<button v-if="auth.user" @click="doLogout"'],
        ['v-if="count > 0"', 'v-if="cart.count > 0"'],
        ['>{{ count }}</span>', '>{{ cart.count }}</span>'],
        ['const { user, logout } = useAuth();', 'const auth = useAuth();'],
        ['const { count } = useCart();', 'const cart = useCart();'],
        ['await logout();', 'await auth.logout();'],
    ]],
    ['resources/js/components/CartDrawer.vue', [
        ['v-if="count"', 'v-if="cart.count"'],
        ['>{{ count }}</span>', '>{{ cart.count }}</span>'],
        ['v-if="!items.length"', 'v-if="!cart.items.length"'],
        ['v-for="item in items"', 'v-for="item in cart.items"'],
        ['@click="decreaseQuantity(item.key)"', '@click="cart.decreaseQuantity(item.key)"'],
        ['@click="increaseQuantity(item.key)"', '@click="cart.increaseQuantity(item.key)"'],
        ['@click="removeItem(item.key)"', '@click="cart.removeItem(item.key)"'],
        ['v-if="items.length"', 'v-if="cart.items.length"'],
        ['{{ formatRupiah(subtotal) }}', '{{ formatRupiah(cart.subtotal) }}'],
        ['{{ formatRupiah(serviceCharge) }}', '{{ formatRupiah(cart.serviceCharge) }}'],
        ['{{ formatRupiah(total) }}', '{{ formatRupiah(cart.total) }}'],
        ['const { items, count, subtotal, serviceCharge, total, removeItem, increaseQuantity, decreaseQuantity } = useCart();', 'const cart = useCart();'],
    ]],
    ['resources/js/pages/Login.vue', [
        ['await login(form.email, form.password);', 'await auth.login(form.email, form.password);'],
        ["if (user.value?.role === 'admin'", "if (auth.user?.role === 'admin'"],
        ['const { login, user } = useAuth();', 'const auth = useAuth();'],
        [':disabled="loading"', ':disabled="auth.loading"'],
        ['<LoaderCircle v-if="loading"', '<LoaderCircle v-if="auth.loading"'],
        ['const loading = ref(false);', ''],
        ['loading.value = true;', ''],
        ['} finally {\n        }', '}'],
    ]],
    ['resources/js/pages/Register.vue', [
        ['await register({ ...form });', 'await auth.register({ ...form });'],
        ['const { register } = useAuth();', 'const auth = useAuth();'],
        [':disabled="loading"', ':disabled="auth.loading"'],
        ['<LoaderCircle v-if="loading"', '<LoaderCircle v-if="auth.loading"'],
        ['const loading = ref(false);', ''],
        ['loading.value = true;', ''],
        ['} finally {\n        loading.value = false;\n    }', '}'],
    ]],
    ['resources/js/layouts/AdminLayout.vue', [
        ['{{ user?.name?.charAt(0).toUpperCase() }}', '{{ auth.user?.name?.charAt(0).toUpperCase() }}'],
        ['{{ user?.name }}', '{{ auth.user?.name }}'],
        ['const { user, logout } = useAuth();', 'const auth = useAuth();'],
        ['await logout();', 'await auth.logout();'],
    ]],
];

for (const [f, pairs] of edits) {
    let s = fs.readFileSync(f, 'utf8');
    let miss = [];
    for (const [a, b] of pairs) {
        if (!s.includes(a)) miss.push(a.slice(0, 50));
        s = s.split(a).join(b);
    }
    fs.writeFileSync(f, s);
    console.log((miss.length ? 'MISS ' + JSON.stringify(miss) + ' in ' : 'OK ') + f);
}
