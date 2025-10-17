<script setup lang="ts">
import { watch } from 'vue';
import { type ViewController } from '../../composables/use-view-controller';
import { usePinchZoom } from '../../composables/use-pinch-zoom';
import { debounce } from '@jobindex/lib';

const { controller } = defineProps<{ controller: ViewController }>();

const viewportContainer = controller.viewportElement;

watch(
    () => controller.scale.value,
    (newScale, previousScale) => {
        if (!viewportContainer.value) return;

        // Keep scroll offset in viewport when scaling

        const origin = {
            x:
                viewportContainer.value.scrollTop +
                viewportContainer.value.clientHeight / 2,
            y:
                viewportContainer.value.scrollLeft +
                viewportContainer.value.clientWidth / 2,
        };

        const scaleDifference = newScale / previousScale - 1;
        const top = viewportContainer.value.offsetTop;
        const left = viewportContainer.value.offsetLeft;

        viewportContainer.value.scrollTop += (origin.x - top) * scaleDifference;
        viewportContainer.value.scrollLeft +=
            (origin.y - left) * scaleDifference;
    }
);

const onScrollDebouncer = debounce(
    () => {
        if (!viewportContainer.value) return;

        // Set current page based on scrolling the viewport

        const pageHeight = Math.floor(
            viewportContainer.value.scrollHeight / controller.pageCount.value
        );
        const viewportCenter =
            viewportContainer.value.scrollTop +
            viewportContainer.value.clientHeight / 2;

        const centeredPage = Math.floor(viewportCenter / pageHeight) + 1;

        controller.setCurrentPage(centeredPage);
    },
    100,
    200
);

usePinchZoom(viewportContainer, controller);

watch(viewportContainer, (container, _old, onCleanup) => {
    if (!container) return;

    container.addEventListener('scroll', onScrollDebouncer.debounced);

    onCleanup(() => {
        container.removeEventListener('scroll', onScrollDebouncer.debounced);
    });
});
</script>

<template>
    <div ref="viewportContainer" class="pdf-viewport">
        <div class="pdf-viewport-content">
            <slot />
        </div>
    </div>
</template>

<style>
.pdf-viewport {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: auto;
}

.pdf-viewport-content {
    display: block;
    overflow: visible;
    width: fit-content;
    margin: 0 auto;
    touch-action: pan-x pan-y;
}
</style>
