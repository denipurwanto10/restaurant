<template>
    <div class="space-y-6">
        <section>
            <div class="flex items-center justify-between mb-3">
                <h3 class="font-serif text-xl font-bold">Branches</h3>
                <button @click="openBranchForm()" class="inline-flex items-center gap-1.5 bg-espresso-900 text-cream-50 text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-espresso-700 dark:bg-gold-500 dark:text-espresso-900 dark:hover:bg-gold-400 transition">
                    <Plus class="w-4 h-4" /> Add Branch
                </button>
            </div>
            <div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                <div v-for="b in branches" :key="b.id" class="bg-white rounded-2xl border border-cream-200 p-5 dark:bg-[#211a12] dark:border-white/10">
                    <h4 class="font-serif text-lg font-bold">{{ b.name }}</h4>
                    <p class="text-sm text-espresso-700/60 mt-1 dark:text-cream-200">{{ b.address }}, {{ b.city }}</p>
                    <p class="text-sm text-espresso-700/60 mt-1 dark:text-cream-200">{{ b.phone }} · {{ b.menus_count }} menus</p>
                    <div class="flex gap-2 mt-3.5">
                        <button @click="openBranchForm(b)" class="text-xs font-bold border border-cream-200 px-4 py-2 rounded-full hover:border-espresso-900 transition dark:border-white/10 dark:hover:border-gold-400">Edit</button>
                        <button @click="removeBranch(b)" class="text-xs font-bold border border-red-200 dark:border-red-500/30 text-red-600 px-4 py-2 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 transition dark:text-red-400">Deactivate</button>
                    </div>
                </div>
            </div>
        </section>

        <section>
            <div class="flex items-center justify-between mb-3">
                <h3 class="font-serif text-xl font-bold">Promos</h3>
                <button @click="openPromoForm()" class="inline-flex items-center gap-1.5 bg-espresso-900 text-cream-50 text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-espresso-700 dark:bg-gold-500 dark:text-espresso-900 dark:hover:bg-gold-400 transition">
                    <Plus class="w-4 h-4" /> Add Promo
                </button>
            </div>
            <div class="bg-white rounded-2xl border border-cream-200 divide-y divide-cream-100 dark:bg-[#211a12] dark:border-white/10 dark:divide-white/10">
                <div v-for="p in promos" :key="p.id" class="flex items-center gap-3 px-5 py-4">
                    <span class="font-mono font-bold bg-cream-100 px-3 py-1.5 rounded-lg text-sm dark:bg-[#2c2318]">{{ p.code }}</span>
                    <div class="flex-1"><p class="font-bold text-sm">{{ p.title }}</p><p class="text-xs text-espresso-700/55 dark:text-cream-200">{{ p.description }}</p></div>
                    <button @click="removePromo(p)" class="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 transition dark:text-red-400" aria-label="Delete promo"><Trash2 class="w-4 h-4" /></button>
                </div>
                <p v-if="!promos.length" class="text-center text-sm text-espresso-700/60 py-8 dark:text-cream-200">No promos yet.</p>
            </div>
        </section>

        <section class="grid lg:grid-cols-2 gap-4">
            <div class="bg-white rounded-2xl border border-cream-200 p-5 dark:bg-[#211a12] dark:border-white/10">
                <h3 class="font-serif text-xl font-bold">Customers ({{ customers.length }})</h3>
                <ul class="mt-3 space-y-2.5 text-sm max-h-72 overflow-y-auto">
                    <li v-for="c in customers" :key="c.id" class="flex items-center gap-3">
                        <span class="w-9 h-9 rounded-full bg-cream-100 flex items-center justify-center font-bold shrink-0 dark:bg-[#2c2318]">{{ c.name.charAt(0) }}</span>
                        <div class="min-w-0"><p class="font-semibold truncate">{{ c.name }}</p><p class="text-xs text-espresso-700/55 dark:text-cream-200">{{ c.email }} · {{ c.orders_count }} orders</p></div>
                    </li>
                </ul>
            </div>
            <div class="bg-white rounded-2xl border border-cream-200 p-5 dark:bg-[#211a12] dark:border-white/10">
                <h3 class="font-serif text-xl font-bold">Reviews</h3>
                <ul class="mt-3 space-y-2.5 text-sm max-h-72 overflow-y-auto">
                    <li v-for="r in reviews" :key="r.id" class="border border-cream-100 rounded-xl p-3 dark:border-white/10">
                        <p class="font-semibold">{{ r.customer_name }} <span class="text-gold-500">★ {{ r.rating }}</span></p>
                        <p class="text-espresso-700/70 text-[13px] mt-0.5 line-clamp-2 dark:text-cream-200">{{ r.comment }}</p>
                        <button @click="toggleReview(r)" class="text-xs font-bold mt-1.5" :class="r.is_approved ? 'text-green-700 dark:text-green-400' : 'text-espresso-700/50 dark:text-cream-200/60'">
                            {{ r.is_approved ? 'Visible — hide?' : 'Hidden — show?' }}
                        </button>
                    </li>
                </ul>
            </div>
        </section>

        <!-- Branch modal -->
        <Transition name="modal">
            <div v-if="showBranch" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6">
                <div class="absolute inset-0 bg-espresso-900/50" @click="showBranch = false"></div>
                <div class="modal-card relative bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto dark:bg-[#211a12]">
                    <h3 class="font-serif text-2xl font-bold">{{ editingBranch ? 'Edit Branch' : 'Add Branch' }}</h3>
                    <div class="grid sm:grid-cols-2 gap-3.5 mt-5">
                        <div class="sm:col-span-2"><label class="text-sm font-medium">Name *</label><input v-model="branchForm.name" type="text" class="mt-1 w-full px-4 py-2.5 rounded-xl border border-cream-200 text-sm dark:border-white/10" /></div>
                        <div class="sm:col-span-2"><label class="text-sm font-medium">Address *</label><input v-model="branchForm.address" type="text" class="mt-1 w-full px-4 py-2.5 rounded-xl border border-cream-200 text-sm dark:border-white/10" /></div>
                        <div><label class="text-sm font-medium">City *</label><input v-model="branchForm.city" type="text" class="mt-1 w-full px-4 py-2.5 rounded-xl border border-cream-200 text-sm dark:border-white/10" /></div>
                        <div><label class="text-sm font-medium">Phone *</label><input v-model="branchForm.phone" type="text" class="mt-1 w-full px-4 py-2.5 rounded-xl border border-cream-200 text-sm dark:border-white/10" /></div>
                        <div><label class="text-sm font-medium">Latitude *</label><input v-model.number="branchForm.latitude" type="number" step="any" class="mt-1 w-full px-4 py-2.5 rounded-xl border border-cream-200 text-sm dark:border-white/10" /></div>
                        <div><label class="text-sm font-medium">Longitude *</label><input v-model.number="branchForm.longitude" type="number" step="any" class="mt-1 w-full px-4 py-2.5 rounded-xl border border-cream-200 text-sm dark:border-white/10" /></div>
                        <div class="sm:col-span-2"><label class="text-sm font-medium">Opening hours *</label><input v-model="branchForm.opening_hours" type="text" class="mt-1 w-full px-4 py-2.5 rounded-xl border border-cream-200 text-sm dark:border-white/10" /></div>
                        <div class="sm:col-span-2"><label class="text-sm font-medium">Description</label><textarea v-model="branchForm.description" rows="2" class="mt-1 w-full px-4 py-2.5 rounded-xl border border-cream-200 text-sm dark:border-white/10"></textarea></div>
                        <div class="sm:col-span-2"><label class="text-sm font-medium">Facilities (comma separated)</label><input v-model="branchForm.facilities" type="text" class="mt-1 w-full px-4 py-2.5 rounded-xl border border-cream-200 text-sm dark:border-white/10" /></div>
                    </div>
                    <div class="flex gap-2.5 mt-6">
                        <button @click="showBranch = false" class="flex-1 py-3 rounded-full border border-cream-200 font-semibold text-sm dark:border-white/10">Cancel</button>
                        <button @click="saveBranch" :disabled="saving" class="flex-1 py-3 rounded-full bg-espresso-900 dark:bg-gold-500 text-cream-50 dark:text-espresso-900 font-semibold text-sm disabled:opacity-50">{{ saving ? 'Saving…' : 'Save' }}</button>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- Promo modal -->
        <Transition name="modal">
            <div v-if="showPromo" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6">
                <div class="absolute inset-0 bg-espresso-900/50" @click="showPromo = false"></div>
                <div class="modal-card relative bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 dark:bg-[#211a12]">
                    <h3 class="font-serif text-2xl font-bold">Add Promo</h3>
                    <div class="space-y-3.5 mt-5">
                        <div><label class="text-sm font-medium">Code *</label><input v-model="promoForm.code" type="text" class="mt-1 w-full px-4 py-2.5 rounded-xl border border-cream-200 text-sm uppercase dark:border-white/10" /></div>
                        <div><label class="text-sm font-medium">Title *</label><input v-model="promoForm.title" type="text" class="mt-1 w-full px-4 py-2.5 rounded-xl border border-cream-200 text-sm dark:border-white/10" /></div>
                        <div class="grid grid-cols-2 gap-3">
                            <div><label class="text-sm font-medium">Type</label><select v-model="promoForm.discount_type" class="mt-1 w-full px-4 py-2.5 rounded-xl border border-cream-200 text-sm bg-white dark:border-white/10 dark:bg-[#211a12]"><option value="percent">Percent %</option><option value="fixed">Fixed Rp</option></select></div>
                            <div><label class="text-sm font-medium">Value *</label><input v-model.number="promoForm.discount_value" type="number" min="1" class="mt-1 w-full px-4 py-2.5 rounded-xl border border-cream-200 text-sm dark:border-white/10" /></div>
                        </div>
                        <div><label class="text-sm font-medium">Min. order (Rp)</label><input v-model.number="promoForm.min_order" type="number" min="0" class="mt-1 w-full px-4 py-2.5 rounded-xl border border-cream-200 text-sm dark:border-white/10" /></div>
                    </div>
                    <div class="flex gap-2.5 mt-6">
                        <button @click="showPromo = false" class="flex-1 py-3 rounded-full border border-cream-200 font-semibold text-sm dark:border-white/10">Cancel</button>
                        <button @click="savePromo" :disabled="saving" class="flex-1 py-3 rounded-full bg-espresso-900 dark:bg-gold-500 text-cream-50 dark:text-espresso-900 font-semibold text-sm disabled:opacity-50">{{ saving ? 'Saving…' : 'Save' }}</button>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { Plus, Trash2 } from 'lucide-vue-next';
import api, { errorMessage } from '../services/api';
import { useToast } from '../stores/toast';

const branches = ref([]);
const promos = ref([]);
const customers = ref([]);
const reviews = ref([]);
const showBranch = ref(false);
const showPromo = ref(false);
const editingBranch = ref(null);
const saving = ref(false);
const branchForm = reactive({ name: '', address: '', city: '', phone: '', latitude: null, longitude: null, opening_hours: '', description: '', facilities: '' });
const promoForm = reactive({ code: '', title: '', discount_type: 'percent', discount_value: 10, min_order: 0 });
const { success, error } = useToast();

async function fetchAll() {
    try {
        const [b, p, c, r] = await Promise.all([
            api.get('/admin/branches'), api.get('/admin/promos'),
            api.get('/admin/customers'), api.get('/admin/reviews'),
        ]);
        branches.value = b.data.data ?? b.data;
        promos.value = p.data.data ?? p.data;
        customers.value = c.data.data ?? [];
        reviews.value = r.data.data ?? [];
    } catch { error('Failed to load data.'); }
}

function openBranchForm(b = null) {
    editingBranch.value = b;
    Object.assign(branchForm, {
        name: b?.name ?? '', address: b?.address ?? '', city: b?.city ?? '', phone: b?.phone ?? '',
        latitude: b?.latitude ?? null, longitude: b?.longitude ?? null,
        opening_hours: b?.opening_hours ?? '', description: b?.description ?? '', facilities: b?.facilities ?? '',
    });
    showBranch.value = true;
}

async function saveBranch() {
    saving.value = true;
    try {
        const payload = { ...branchForm, is_active: true };
        if (editingBranch.value) {
            await api.put(`/admin/branches/${editingBranch.value.id}`, payload);
            success('Branch updated.');
        } else {
            await api.post('/admin/branches', payload);
            success('Branch created.');
        }
        showBranch.value = false;
        await fetchAll();
    } catch (err) { error(errorMessage(err, 'Failed to save branch.')); }
    finally { saving.value = false; }
}

async function removeBranch(b) {
    if (!confirm(`Deactivate "${b.name}"?`)) return;
    try {
        await api.delete(`/admin/branches/${b.id}`);
        success('Branch deactivated.');
        await fetchAll();
    } catch { error('Failed to deactivate branch.'); }
}

function openPromoForm() {
    Object.assign(promoForm, { code: '', title: '', discount_type: 'percent', discount_value: 10, min_order: 0 });
    showPromo.value = true;
}

async function savePromo() {
    saving.value = true;
    try {
        await api.post('/admin/promos', { ...promoForm, code: promoForm.code.toUpperCase(), is_active: true });
        success('Promo created.');
        showPromo.value = false;
        await fetchAll();
    } catch (err) { error(errorMessage(err, 'Failed to save promo.')); }
    finally { saving.value = false; }
}

async function removePromo(p) {
    if (!confirm(`Delete promo "${p.code}"?`)) return;
    try {
        await api.delete(`/admin/promos/${p.id}`);
        promos.value = promos.value.filter((x) => x.id !== p.id);
        success('Promo deleted.');
    } catch { error('Failed to delete promo.'); }
}

async function toggleReview(r) {
    try {
        await api.post(`/admin/reviews/${r.id}/toggle`);
        r.is_approved = !r.is_approved;
        success('Review visibility updated.');
    } catch { error('Failed to update review.'); }
}

onMounted(fetchAll);
</script>
