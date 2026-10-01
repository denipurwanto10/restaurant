<template>
    <div class="space-y-5 max-w-3xl">
        <button @click="openForm()" class="inline-flex items-center gap-1.5 bg-espresso-900 text-cream-50 text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-espresso-700 dark:bg-gold-500 dark:text-espresso-900 dark:hover:bg-gold-400 transition">
            <Plus class="w-4 h-4" /> Add Category
        </button>

        <div class="bg-white rounded-2xl border border-cream-200 divide-y divide-cream-100 dark:bg-[#211a12] dark:border-white/10 dark:divide-white/10">
            <div v-for="c in categories" :key="c.id" class="flex items-center gap-3 px-5 py-4">
                <span class="font-bold text-espresso-700/40 text-sm w-6 dark:text-cream-200">{{ c.sort_order }}</span>
                <div class="flex-1">
                    <p class="font-bold">{{ c.name }}</p>
                    <p class="text-xs text-espresso-700/55 dark:text-cream-200">{{ c.menus_count ?? 0 }} menus</p>
                </div>
                <button @click="openForm(c)" class="p-2 rounded-lg hover:bg-cream-100 transition dark:hover:bg-white/10" aria-label="Edit"><Pencil class="w-4 h-4" /></button>
                <button @click="remove(c)" class="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 dark:hover:text-red-400 transition" aria-label="Delete"><Trash2 class="w-4 h-4" /></button>
            </div>
            <p v-if="!categories.length" class="text-center text-sm text-espresso-700/60 py-10 dark:text-cream-200">No categories yet.</p>
        </div>

        <Transition name="modal">
            <div v-if="showForm" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6">
                <div class="absolute inset-0 bg-espresso-900/50" @click="showForm = false"></div>
                <div class="modal-card relative bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 dark:bg-[#211a12]">
                    <h3 class="font-serif text-2xl font-bold">{{ editing ? 'Edit Category' : 'Add Category' }}</h3>
                    <div class="space-y-3.5 mt-5">
                        <div>
                            <label class="text-sm font-medium">Name *</label>
                            <input v-model="form.name" type="text" class="mt-1 w-full px-4 py-2.5 rounded-xl border border-cream-200 text-sm dark:border-white/10" />
                        </div>
                        <div>
                            <label class="text-sm font-medium">Description</label>
                            <textarea v-model="form.description" rows="2" class="mt-1 w-full px-4 py-2.5 rounded-xl border border-cream-200 text-sm dark:border-white/10"></textarea>
                        </div>
                        <div>
                            <label class="text-sm font-medium">Sort order</label>
                            <input v-model.number="form.sort_order" type="number" min="0" class="mt-1 w-full px-4 py-2.5 rounded-xl border border-cream-200 text-sm dark:border-white/10" />
                        </div>
                    </div>
                    <div class="flex gap-2.5 mt-6">
                        <button @click="showForm = false" class="flex-1 py-3 rounded-full border border-cream-200 font-semibold text-sm dark:border-white/10">Cancel</button>
                        <button @click="save" :disabled="saving" class="flex-1 py-3 rounded-full bg-espresso-900 dark:bg-gold-500 text-cream-50 dark:text-espresso-900 font-semibold text-sm disabled:opacity-50">
                            {{ saving ? 'Saving…' : 'Save' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { Pencil, Plus, Trash2 } from 'lucide-vue-next';
import api, { errorMessage } from '../services/api';
import { useToast } from '../stores/toast';

const categories = ref([]);
const showForm = ref(false);
const editing = ref(null);
const saving = ref(false);
const form = reactive({ name: '', description: '', sort_order: 0 });
const { success, error } = useToast();

async function fetchAll() {
    try {
        const { data } = await api.get('/admin/categories');
        categories.value = data.data;
    } catch { error('Failed to load categories.'); }
}

function openForm(c = null) {
    editing.value = c;
    Object.assign(form, { name: c?.name ?? '', description: c?.description ?? '', sort_order: c?.sort_order ?? categories.value.length + 1 });
    showForm.value = true;
}

async function save() {
    saving.value = true;
    try {
        if (editing.value) {
            await api.put(`/admin/categories/${editing.value.id}`, { ...form });
            success('Category updated.');
        } else {
            await api.post('/admin/categories', { ...form });
            success('Category created.');
        }
        showForm.value = false;
        await fetchAll();
    } catch (err) {
        error(errorMessage(err, 'Failed to save category.'));
    } finally {
        saving.value = false;
    }
}

async function remove(c) {
    if (!confirm(`Delete "${c.name}"?`)) return;
    try {
        await api.delete(`/admin/categories/${c.id}`);
        categories.value = categories.value.filter((x) => x.id !== c.id);
        success('Category deleted.');
    } catch (err) {
        error(errorMessage(err, 'Cannot delete category with menus.'));
    }
}

onMounted(fetchAll);
</script>
