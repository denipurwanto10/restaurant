<template>
    <div class="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div class="w-full max-w-md bg-white rounded-3xl border border-cream-200 shadow-xl p-7 sm:p-9 animate-fade-up dark:bg-[#211a12] dark:border-white/10">
            <div class="text-center">
                <span class="inline-flex w-14 h-14 rounded-full bg-espresso-900 text-gold-400 items-center justify-center font-serif text-3xl font-bold">S</span>
                <h1 class="font-serif text-3xl font-bold mt-4">Join Saveur</h1>
                <p class="text-sm text-espresso-700/65 mt-1 dark:text-cream-200">Create an account for faster checkout.</p>
            </div>
            <form @submit.prevent="submit" class="mt-7 space-y-4">
                <div>
                    <label class="text-sm font-medium">Full name</label>
                    <input v-model="form.name" type="text" required placeholder="Jane Doe" class="mt-1 w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 dark:focus:ring-gold-400/40" :class="errors.name ? 'border-red-400' : 'border-cream-200 dark:border-white/10'" />
                    <p v-if="errors.name" class="text-xs text-red-600 mt-1 dark:text-red-400">{{ errors.name[0] }}</p>
                </div>
                <div>
                    <label class="text-sm font-medium">Email</label>
                    <input v-model="form.email" type="email" required placeholder="you@email.com" class="mt-1 w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 dark:focus:ring-gold-400/40" :class="errors.email ? 'border-red-400' : 'border-cream-200 dark:border-white/10'" />
                    <p v-if="errors.email" class="text-xs text-red-600 mt-1 dark:text-red-400">{{ errors.email[0] }}</p>
                </div>
                <div>
                    <label class="text-sm font-medium">Phone (optional)</label>
                    <input v-model="form.phone" type="tel" placeholder="0812…" class="mt-1 w-full px-4 py-3 rounded-xl border border-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 dark:border-white/10 dark:focus:ring-gold-400/40" />
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="text-sm font-medium">Password</label>
                        <input v-model="form.password" type="password" required minlength="8" placeholder="Min. 8 chars" class="mt-1 w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 dark:focus:ring-gold-400/40" :class="errors.password ? 'border-red-400' : 'border-cream-200 dark:border-white/10'" />
                    </div>
                    <div>
                        <label class="text-sm font-medium">Confirm</label>
                        <input v-model="form.password_confirmation" type="password" required placeholder="Repeat" class="mt-1 w-full px-4 py-3 rounded-xl border border-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 dark:border-white/10 dark:focus:ring-gold-400/40" />
                    </div>
                </div>
                <p v-if="errors.password" class="text-xs text-red-600 dark:text-red-400">{{ errors.password[0] }}</p>
                <button :disabled="auth.loading" class="w-full inline-flex items-center justify-center gap-2 bg-espresso-900 text-cream-50 font-semibold py-3.5 rounded-full hover:bg-espresso-700 dark:bg-gold-500 dark:text-espresso-900 dark:hover:bg-gold-400 transition disabled:opacity-50">
                    <LoaderCircle v-if="auth.loading" class="w-5 h-5 animate-spin" /> <template v-else>Create Account</template>
                </button>
            </form>
            <p class="text-sm text-center mt-5 text-espresso-700/70 dark:text-cream-200">
                Already have an account? <RouterLink to="/login" class="font-bold text-espresso-900 hover:text-gold-600 dark:text-cream-100">Login</RouterLink>
            </p>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { LoaderCircle } from 'lucide-vue-next';
import { useAuth } from '../stores/auth';
import { errorMessage, validationErrors } from '../services/api';
import { useToast } from '../stores/toast';

const router = useRouter();
const auth = useAuth();
const { success, error } = useToast();

const form = reactive({ name: '', email: '', phone: '', password: '', password_confirmation: '' });
const errors = ref({});


async function submit() {
    errors.value = {};
    
    try {
        await auth.register({ ...form });
        success('Registration successful. Welcome!');
        router.push('/');
    } catch (err) {
        errors.value = validationErrors(err);
        error(errorMessage(err, 'Registration failed.'));
    }
}
</script>
