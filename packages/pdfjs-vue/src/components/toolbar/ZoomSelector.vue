<script setup lang="ts">
import type { ScaleMode, ScaleOption } from 'src/types';
import { ref, watch } from 'vue';

const props = defineProps<{
    current: ScaleOption;
    options: ScaleOption[];
}>();

const getOptionString = (opt: ScaleOption) => {
    if (opt.mode === 'absolute') {
        return `${opt.mode}:${opt.absoluteScale ?? ''}`;
    }

    return `${opt.mode}:`;
};

const getOptionFromOptionString = (str: string): ScaleOption => {
    const strParts = str.split(':');

    // FIXME: validate string
    const mode = strParts[0] as ScaleMode;

    if (mode == 'absolute') {
        const scl = Number.parseFloat(strParts[1]);
        return {
            mode: 'absolute',
            absoluteScale: scl,
        };
    } else {
        return {
            mode,
        };
    }
};

const getOptionLabel = (opt: ScaleOption): string => {
    if (opt.mode === 'absolute') {
        return `${Math.round(100 * (opt.absoluteScale ?? 0))}%`;
    }
    return opt.label ?? opt.mode;
};

const emit = defineEmits<{ (e: 'change', scale: ScaleOption): void }>();
const selected = ref(getOptionString(props.current));

watch(
    () => props.current,
    () => {
        selected.value = getOptionString(props.current);
    }
);
</script>

<template>
    <select
        v-model="selected"
        class="toolbar-zoom-selector"
        title="Select Zoom Level"
        @change="
            () => {
                const selectedOption = getOptionFromOptionString(selected);
                emit('change', selectedOption);
            }
        "
    >
        <option
            v-for="(option, index) in props.options"
            :key="index"
            :value="getOptionString(option)"
        >
            {{ getOptionLabel(option) }}
        </option>
    </select>
</template>

<style scoped>
.toolbar-zoom-selector {
}
</style>
