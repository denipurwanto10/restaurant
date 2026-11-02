<template>
    <div class="relative" :class="$attrs.class">
        <button
            ref="trigger"
            type="button"
            role="combobox"
            aria-haspopup="listbox"
            :aria-expanded="open"
            :aria-controls="id"
            class="group w-full min-h-[2.75rem] flex items-center justify-between gap-3 pl-4 pr-3 py-2.5 rounded-[0.875rem] border text-sm text-left shadow-soft bg-white dark:bg-[#1b1510] transition-[border-color,box-shadow] duration-300"
            :class="open
                ? 'border-gold-500 ring-4 ring-gold-500/15'
                : 'border-espresso-900/10 hover:border-espresso-900/25 dark:border-white/10 dark:hover:border-white/25'"
            @click="toggle"
            @keydown="onKey"
        >
            <span class="truncate font-medium" :class="[selected ? '' : 'text-espresso-500/70 dark:text-cream-200/50 font-normal', capitalize && 'capitalize']">
                {{ selected ? selected.label : placeholder }}
            </span>
            <ChevronDown class="w-4 h-4 shrink-0 text-espresso-500 dark:text-gold-400 transition-transform duration-500" :class="open && 'rotate-180'" />
        </button>

        <Teleport to="body">
            <Transition name="select">
                <div
                    v-if="open"
                    class="fixed inset-0 z-[80]"
                    :class="sheet && 'bg-espresso-900/40 backdrop-blur-[3px]'"
                    @pointerdown.self="close"
                >
                    <div
                        :id="id"
                        role="listbox"
                        class="fixed overflow-y-auto overscroll-contain bg-cream-50 dark:bg-[#1b1510] border border-espresso-900/10 dark:border-white/10 shadow-lift"
                        :class="sheet
                            ? 'select-sheet inset-x-0 bottom-0 max-h-[75vh] rounded-t-[1.75rem] px-3 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]'
                            : ['select-pop rounded-[1rem] p-1.5', pos.flip && 'is-flip']"
                        :style="sheet ? null : pos.style"
                    >
                        <template v-if="sheet">
                            <div class="mx-auto w-10 h-1 rounded-full bg-espresso-900/15 dark:bg-white/20 mb-3"></div>
                            <p v-if="label" class="px-3 pb-2 text-[11px] font-medium uppercase tracking-[0.22em] text-gold-600 dark:text-gold-400">{{ label }}</p>
                        </template>
                        <button
                            v-for="(it, i) in items"
                            :id="`${id}-${i}`"
                            :key="String(it.value)"
                            type="button"
                            role="option"
                            :aria-selected="it.value === modelValue"
                            :ref="(el) => (optionRefs[i] = el)"
                            class="w-full flex items-center justify-between gap-3 text-left rounded-[0.7rem] transition-colors duration-200"
                            :class="[
                                sheet ? 'px-4 py-3.5 text-base' : 'px-3 py-2.5 text-sm',
                                capitalize && 'capitalize',
                                i === active ? 'bg-espresso-900/[0.06] dark:bg-white/10' : '',
                                it.value === modelValue ? 'text-gold-600 dark:text-gold-400 font-medium' : 'text-espresso-800 dark:text-cream-100',
                            ]"
                            @pointermove="active = i"
                            @click="choose(it)"
                        >
                            <span class="truncate">{{ it.label }}</span>
                            <Check v-if="it.value === modelValue" class="w-4 h-4 shrink-0" />
                        </button>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script>
export default { inheritAttrs: false };
</script>

<script setup>
import { computed, nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue';
import { Check, ChevronDown } from 'lucide-vue-next';

const props = defineProps({
    modelValue: { default: null },
    options: { type: Array, required: true },   // ['a', 'b'] or [{ value, label }]
    placeholder: { type: String, default: 'Select…' },
    label: { type: String, default: '' },       // title shown on the mobile sheet
    capitalize: { type: Boolean, default: false },
});
const emit = defineEmits(['update:modelValue']);

let seq = 0;
const id = `bs-${++seq}-${Math.random().toString(36).slice(2, 7)}`;

const items = computed(() => props.options.map((o) => (o !== null && typeof o === 'object' ? o : { value: o, label: String(o) })));
const selected = computed(() => items.value.find((i) => i.value === props.modelValue) || null);

const trigger = ref(null);
const optionRefs = [];
const open = ref(false);
const sheet = ref(false);
const active = ref(0);
const pos = reactive({ style: {}, flip: false });

function place() {
    const r = trigger.value?.getBoundingClientRect();
    if (!r) return;
    const need = Math.min(256, items.value.length * 42 + 14);
    const below = window.innerHeight - r.bottom - 12;
    const above = r.top - 12;
    pos.flip = below < need && above > below;
    const width = Math.max(r.width, 208);
    const left = Math.max(8, Math.min(r.left, window.innerWidth - width - 8));
    pos.style = {
        left: `${left}px`,
        width: `${width}px`,
        maxHeight: `${Math.min(256, Math.max(120, pos.flip ? above : below))}px`,
        ...(pos.flip ? { bottom: `${window.innerHeight - r.top + 8}px` } : { top: `${r.bottom + 8}px` }),
    };
}

function show() {
    sheet.value = window.matchMedia('(max-width: 639px)').matches;
    active.value = Math.max(0, items.value.findIndex((i) => i.value === props.modelValue));
    if (!sheet.value) place();
    open.value = true;
    nextTick(() => optionRefs[active.value]?.scrollIntoView({ block: 'nearest' }));
}
function close() { open.value = false; }
function toggle() { open.value ? close() : show(); }
function choose(it) {
    emit('update:modelValue', it.value);
    close();
    trigger.value?.focus();
}
function move(d) {
    active.value = (active.value + d + items.value.length) % items.value.length;
    nextTick(() => optionRefs[active.value]?.scrollIntoView({ block: 'nearest' }));
}
function onKey(e) {
    if (!open.value) {
        if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) { e.preventDefault(); show(); }
        return;
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Home') { e.preventDefault(); active.value = 0; }
    else if (e.key === 'End') { e.preventDefault(); active.value = items.value.length - 1; }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); items.value[active.value] && choose(items.value[active.value]); }
    else if (e.key === 'Escape' || e.key === 'Tab') close();
}

const reposition = () => { if (open.value && !sheet.value) place(); };
watch(open, (v) => {
    const fn = v ? 'addEventListener' : 'removeEventListener';
    window[fn]('resize', reposition);
    window[fn]('scroll', reposition, true);
    if (sheet.value) document.body.style.overflow = v ? 'hidden' : '';
});
onBeforeUnmount(() => {
    window.removeEventListener('resize', reposition);
    window.removeEventListener('scroll', reposition, true);
    document.body.style.overflow = '';
});
</script>
