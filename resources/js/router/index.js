import { createRouter, createWebHistory } from 'vue-router';
import CustomerLayout from '../layouts/CustomerLayout.vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import { useAuth } from '../stores/auth';

import Home from '../pages/Home.vue';
import Menu from '../pages/Menu.vue';
import MenuDetail from '../pages/MenuDetail.vue';
import Checkout from '../pages/Checkout.vue';
import Payment from '../pages/Payment.vue';
import Orders from '../pages/Orders.vue';
import OrderDetail from '../pages/OrderDetail.vue';
import Branches from '../pages/Branches.vue';
import BranchDetail from '../pages/BranchDetail.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import About from '../pages/About.vue';

import Dashboard from '../admin/Dashboard.vue';
import OrderManagement from '../admin/OrderManagement.vue';
import MenuManagement from '../admin/MenuManagement.vue';
import CategoryManagement from '../admin/CategoryManagement.vue';
import PaymentManagement from '../admin/PaymentManagement.vue';
import ManageResources from '../admin/ManageResources.vue';

const routes = [
    {
        path: '/',
        component: CustomerLayout,
        children: [
            { path: '', name: 'home', component: Home },
            { path: 'menu', name: 'menu', component: Menu },
            { path: 'menu/:slug', name: 'menu-detail', component: MenuDetail },
            { path: 'checkout', name: 'checkout', component: Checkout },
            { path: 'payment/:invoice', name: 'payment', component: Payment },
            { path: 'orders', name: 'orders', component: Orders },
            { path: 'orders/:number', name: 'order-detail', component: OrderDetail },
            { path: 'branches', name: 'branches', component: Branches },
            { path: 'branches/:slug', name: 'branch-detail', component: BranchDetail },
            { path: 'login', name: 'login', component: Login, meta: { guest: true } },
            { path: 'register', name: 'register', component: Register, meta: { guest: true } },
            { path: 'about', name: 'about', component: About },
        ],
    },
    {
        path: '/admin',
        component: AdminLayout,
        meta: { requiresAdmin: true },
        children: [
            { path: '', name: 'admin-dashboard', component: Dashboard },
            { path: 'orders', name: 'admin-orders', component: OrderManagement },
            { path: 'menus', name: 'admin-menus', component: MenuManagement },
            { path: 'categories', name: 'admin-categories', component: CategoryManagement },
            { path: 'branches', name: 'admin-branches', component: ManageResources },
            { path: 'payments', name: 'admin-payments', component: PaymentManagement },
            { path: 'customers', name: 'admin-customers', component: ManageResources },
            { path: 'promos', name: 'admin-promos', component: ManageResources },
            { path: 'reviews', name: 'admin-reviews', component: ManageResources },
        ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 };
    },
});

router.beforeEach((to) => {
    const user = useAuth().user;

    if (to.meta.requiresAdmin) {
        if (!user) return { path: '/login', query: { redirect: to.fullPath } };
        if (user.role !== 'admin') return { path: '/' };
    }
    if (to.meta.guest && user) {
        return { path: user.role === 'admin' ? '/admin' : '/' };
    }
});

export default router;
