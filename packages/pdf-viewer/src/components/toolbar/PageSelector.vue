<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
    currentPage: number;
    pageCount: number;
}>();

const emit = defineEmits<{
    (e: 'change', page: number): void;
}>();

const selectedPage = ref<number>(props.currentPage);

watch(
    () => props.currentPage,
    () => {
        selectedPage.value = props.currentPage;
    }
);
</script>

<template>
    <div class="page-selector">
        <input
            v-model="selectedPage"
            type="number"
            :min="1"
            :max="pageCount"
            title="Current Page"
            @change="
                () => {
                    // Check if valid integer
                    if (!Number.isInteger(selectedPage)) return;
                    emit('change', selectedPage);
                }
            "
            @blur="
                () => {
                    // Reset input field, to make sure no invalid input is left
                    selectedPage = props.currentPage;
                }
            "
        />
        <span> / {{ pageCount }}</span>
    </div>
</template>

<style scoped>
.page-selector {
    display: flex;
    gap: 0.25em;
    align-items: center;
    white-space: nowrap;

    input[type='number'] {
        -moz-appearance: textfield;
    }
}
</style>
