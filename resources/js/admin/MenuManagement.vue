<template>
    <div class="space-y-5">
        <div class="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div class="relative flex-1 max-w-md">
                <Search class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-500/50 dark:text-cream-200/70" />
                <input v-model="search" type="text" placeholder="Search menus…" class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 dark:border-white/10 dark:bg-[#211a12] dark:focus:ring-gold-400/40" />
            </div>
            <button @click="openForm()" class="inline-flex items-center gap-1.5 bg-espresso-900 text-cream-50 text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-espresso-700 dark:bg-gold-500 dark:text-espresso-900 dark:hover:bg-gold-400 transition">
                <Plus class="w-4 h-4" /> Add Menu
            </button>
        </div>

        <div class="bg-white rounded-2xl border border-cream-200 overflow-hidden dark:bg-[#211a12] dark:border-white/10">
            <div class="overflow-x-auto">
                <table class="w-full text-sm min-w-[720px]">
                    <thead><tr class="text-left text-xs uppercase tracking-wide text-espresso-700/55 bg-cream-50 dark:bg-[#14100b] dark:text-cream-200">
                        <th class="px-4 py-3">Menu</th><th class="px-4 py-3">Category</th><th class="px-4 py-3">Price</th><th class="px-4 py-3">Stock</th><th class="px-4 py-3">Flags</th><th class="px-4 py-3 text-right">Actions</th>
                    </tr></thead>
                    <tbody>
                        <tr v-for="m in menus" :key="m.id" class="border-t border-cream-100 hover:bg-cream-50 dark:border-white/10 dark:hover:bg-white/5">
                            <td class="px-4 py-2.5 font-semibold">{{ m.name }}</td>
                            <td class="px-4 py-2.5">{{ m.category?.name }}</td>
                            <td class="px-4 py-2.5">{{ m.price_formatted }}</td>
                            <td class="px-4 py-2.5">{{ m.stock }}</td>
                            <td class="px-4 py-2.5"><span class="text-xs text-espresso-700/60 dark:text-cream-200">{{ (m.badges || []).join(', ') || '–' }}</span></td>
                            <td class="px-4 py-2.5">
                                <div class="flex justify-end gap-1.5">
                                    <button @click="openForm(m)" class="p-2 rounded-lg hover:bg-cream-100 transition dark:hover:bg-white/10" aria-label="Edit"><Pencil class="w-4 h-4" /></button>
                                    <button @click="removeMenu(m)" class="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 transition dark:text-red-400" aria-label="Delete"><Trash2 class="w-4 h-4" /></button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p v-if="!menus.length && !loading" class="text-center text-sm text-espresso-700/60 py-10 dark:text-cream-200">No menus found.</p>
        </div>

        <!-- Form modal -->
        <Transition name="modal">
            <div v-if="showForm" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
                <div class="absolute inset-0 bg-espresso-900/50" @click="showForm = false"></div>
                <div class="modal-card relative bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto dark:bg-[#211a12]">
                    <h3 class="font-serif text-2xl font-bold">{{ editing ? 'Edit Menu' : 'Add Menu' }}</h3>
                    <div class="grid sm:grid-cols-2 gap-3.5 mt-5">
                        <div class="sm:col-span-2">
                            <label class="text-sm font-medium">Name *</label>
                            <input v-model="form.name" type="text" class="mt-1 w-full px-4 py-2.5 rounded-xl border border-cream-200 text-sm dark:border-white/10" />
                        </div>
                        <div>
                            <label class="text-sm font-medium">Category *</label>
                            <select v-model="form.category_id" class="mt-1 w-full px-4 py-2.5 rounded-xl border border-cream-200 text-sm bg-white dark:border-white/10 dark:bg-[#211a12]">
                                <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
                            </select>
                        </div>
                        <div>
                            <label class="text-sm font-medium">Price (Rp) *</label>
                            <input v-model.number="form.price" type="number" min="0" class="mt-1 w-full px-4 py-2.5 rounded-xl border border-cream-200 text-sm dark:border-white/10" />
                        </div>
                        <div class="sm:col-span-2">
                            <label class="text-sm font-medium">Description</label>
                            <textarea v-model="form.description" rows="2" class="mt-1 w-full px-4 py-2.5 rounded-xl border border-cream-200 text-sm dark:border-white/10"></textarea>
                        </div>
                        <div class="sm:col-span-2">
                            <label class="text-sm font-medium">Ingredients</label>
                            <input v-model="form.ingredients" type="text" class="mt-1 w-full px-4 py-2.5 rounded-xl border border-cream-200 text-sm dark:border-white/10" />
                        </div>
                        <div>
                            <label class="text-sm font-medium">Stock</label>
                            <input v-model.number="form.stock" type="number" min="0" class="mt-1 w-full px-4 py-2.5 rounded-xl border border-cream-200 text-sm dark:border-white/10" />
                        </div>
                        <div>
                            <label class="text-sm font-medium">Photo</label>
                            <input type="file" accept="image/*" @change="onFile" class="mt-1 w-full text-sm file:mr-3 file:px-4 file:py-2 file:rounded-full file:border-0 file:bg-cream-100 dark:file:bg-[#2c2318] file:font-semibold hover:file:bg-cream-200 dark:hover:file:bg-white/10" />
                        </div>
                        <div class="sm:col-span-2 flex flex-wrap gap-2">
                            <label v-for="f in flags" :key="f" class="inline-flex items-center gap-2 text-sm bg-cream-50 border border-cream-200 rounded-full px-3.5 py-1.5 cursor-pointer dark:bg-[#14100b] dark:border-white/10">
                                <input type="checkbox" v-model="form[f]" class="accent-[#a67c28]" /> {{ flagLabel(f) }}
                            </label>
                        </div>
                    </div>
                    <div class="flex gap-2.5 mt-6">
                        <button @click="showForm = false" class="flex-1 py-3 rounded-full border border-cream-200 font-semibold text-sm hover:bg-cream-50 transition dark:border-white/10 dark:hover:bg-white/5">Cancel</button>
                        <button @click="save" :disabled="saving" class="flex-1 py-3 rounded-full bg-espresso-900 text-cream-50 font-semibold text-sm hover:bg-espresso-700 dark:bg-gold-500 dark:text-espresso-900 dark:hover:bg-gold-400 transition disabled:opacity-50">
                            {{ saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Menu' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { Pencil, Plus, Search, Trash2 } from 'lucide-vue-next';
import api, { errorMessage } from '../services/api';
import { useToast } from '../stores/toast';

const menus = ref([]);
const categories = ref([]);
const loading = ref(true);
const search = ref('');
const showForm = ref(false);
const editing = ref(null);
const saving = ref(false);
const file = ref(null);
const flags = ['is_available', 'is_featured', 'is_popular', 'is_new', 'is_vegetarian', 'is_spicy'];
const form = reactive({ name: '', category_id: null, price: 0, description: '', ingredients: '', stock: 100, is_available: true, is_featured: false, is_popular: false, is_new: false, is_vegetarian: false, is_spicy: false });
const { success, error } = useToast();

function flagLabel(f) {
    return f.replace('is_', '').replace(/^\w/, (c) => c.toUpperCase());
}

let debounce;
watch(search, () => { clearTimeout(debounce); debounce = setTimeout(fetchMenus, 350); });

async function fetchMenus() {
    loading.value = true;
    try {
        const { data } = await api.get('/admin/menus', { params: { search: search.value || undefined, per_page: 30 } });
        menus.value = data.data;
    } catch { error('Failed to load menus.'); }
    finally { loading.value = false; }
}

function openForm(m = null) {
    editing.value = m;
    file.value = null;
    Object.assign(form, {
        name: m?.name ?? '', category_id: m?.category?.id ?? categories.value[0]?.id ?? null,
        price: m?.price ?? 0, description: m?.description ?? '', ingredients: m?.ingredients ?? '',
        stock: m?.stock ?? 100, is_available: m?.is_available ?? true, is_featured: m?.is_featured ?? false,
        is_popular: m?.is_popular ?? false, is_new: m?.is_new ?? false,
        is_vegetarian: m?.is_vegetarian ?? false, is_spicy: m?.is_spicy ?? false,
    });
    showForm.value = true;
}

function onFile(e) {
    file.value = e.target.files[0] ?? null;
}

async function save() {
    saving.value = true;
    try {
        const payload = new FormData();
        Object.entries(form).forEach(([k, v]) => {
            payload.append(k, v === true ? '1' : v === false ? '0' : (v ?? ''));
        });
        if (file.value) payload.append('image', file.value);
        if (editing.value) {
            const { data } = await api.post(`/admin/menus/${editing.value.id}`, payload, { params: { _method: 'PUT' } });
            const idx = menus.value.findIndex((m) => m.id === editing.value.id);
            if (idx >= 0) menus.value[idx] = data.menu;
            success('Menu updated.');
        } else {
            await api.post('/admin/menus', payload);
            success('Menu created.');
            await fetchMenus();
        }
        showForm.value = false;
    } catch (err) {
        error(errorMessage(err, 'Failed to save menu.'));
    } finally {
        saving.value = false;
    }
}

async function removeMenu(m) {
    if (!confirm(`Delete "${m.name}"?`)) return;
    try {
        await api.delete(`/admin/menus/${m.id}`);
        menus.value = menus.value.filter((x) => x.id !== m.id);
        success('Menu deleted.');
    } catch {
        error('Failed to delete menu.');
    }
}

onMounted(async () => {
    try {
        const { data } = await api.get('/admin/categories');
        categories.value = data.data;
    } catch { /* ignore */ }
    await fetchMenus();
});
</script>
