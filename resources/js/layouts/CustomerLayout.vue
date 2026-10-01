<template>
    <Navbar @open-cart="cartOpen = true" />
    <main class="min-h-[70vh]">
        <RouterView />
    </main>
    <Footer />
    <CartDrawer :open="cartOpen" @close="cartOpen = false" />
    <ToastHost />
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import CartDrawer from '../components/CartDrawer.vue';
import ToastHost from '../components/ToastHost.vue';

const cartOpen = ref(false);
const route = useRoute();
watch(() => route.fullPath, () => { cartOpen.value = false; });
</script>
