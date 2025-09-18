<script setup lang="ts">
const { progress } = defineProps<{ progress: number }>();
</script>
<template>
    <div class="pdf-viewer-loader">
        <span class="spinner"></span>
        <p>Loading: {{ Math.floor(progress * 100) }}%</p>
    </div>
</template>
<style>
@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
.pdf-viewer-loader {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .spinner {
        display: inline-block;

        width: 1.75rem;
        height: 1.75rem;

        border-radius: 50%;
        border: 4px solid gray;
        border-top-color: white;

        animation-name: spin;
        animation-duration: 1000ms;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
    }
}
</style>
