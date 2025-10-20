<script setup lang="ts">
/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0.d.ts" />
import type { PDFDocumentProxy, PDFPageProxy, RenderTask } from 'pdfjs-dist';
import { computed, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue';
import { useIntersectionObserver } from '../../composables/use-intersectionobserver';
import TextLayer from '../layers/TextLayer.vue';
import type { ViewController } from '../../composables/use-view-controller';
import { createLogger } from '@jobindex/common/lib/logger.ts';
import { debounce } from '@jobindex/common/lib/util.ts';

const { controller, idx, pdf } = defineProps<{
    controller: ViewController;
    idx: number;
    pdf: PDFDocumentProxy;
}>();

const logger = createLogger({ name: `pdf-viewer::PDFPage (idx: ${idx})` });

const container = ref<HTMLDivElement | undefined>();
const canvas = ref<HTMLCanvasElement | undefined>();

let isFirstDraw = true;
let needsRedraw = true;

const visible = ref(false);

const documentPage = shallowRef<PDFPageProxy | undefined>();

const viewport = computed(() =>
    documentPage.value?.getViewport({ scale: controller.scale.value })
);

const renderCanvas = (): RenderTask | undefined => {
    logger.debug('render requested');
    if (!canvas.value) {
        logger.warn('Canvas not defined');
        return;
    }

    const context = canvas.value.getContext('2d');
    if (!context) {
        logger.warn('Canvas 2D context not found');
        return;
    }
    const outputScale = window.devicePixelRatio || 1;
    canvas.value.height = Math.floor(viewport.value!.height * outputScale);
    canvas.value.width = Math.floor(viewport.value!.width * outputScale);

    container.value?.style.setProperty(
        '--scale-factor',
        `${viewport.value?.scale}`
    );
    container.value?.style.setProperty(
        '--user-unit',
        `${viewport.value?.userUnit}`
    );
    container.value?.style.setProperty(
        '--total-scale-factor',
        'calc(var(--scale-factor) * var(--user-unit))'
    );

    const renderContext = {
        intent: 'display',
        canvasContext: context,
        canvas: canvas.value,
        viewport: viewport.value!,
        transform: [outputScale, 0, 0, outputScale, 0, 0],
    };

    const renderTask = documentPage.value!.render(renderContext);
    renderTask?.promise.catch(() => {
        logger.debug('render cancelled');
    }); // Supress uncaught in promise exception when cancelling

    return renderTask;
};

const reset = () => {
    logger.trace('reset');
    if (documentPage.value) {
        documentPage.value.cleanup();
    }

    if (canvas.value) {
        const context = canvas.value.getContext('2d');

        if (context) {
            context.save();
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0, 0, canvas.value.width, canvas.value.height);
            context.restore();
        }
    }
};

let _updateCleanup = () => {};

const update = () => {
    logger.trace('update');
    _updateCleanup();
    if (!documentPage.value) {
        logger.warn('PDF page not found', idx);
        return;
    }

    const pageRenderTask = renderCanvas();

    _updateCleanup = () => {
        pageRenderTask?.cancel();
        _updateCleanup = () => {};
    };

    if (isFirstDraw) isFirstDraw = false;
    if (needsRedraw) needsRedraw = false;
};

const cleanup = () => {
    logger.trace('cleanup');
    _updateCleanup();
};

const _updateDebouncer = debounce(update);

const setVisibility = (visibility: boolean) => {
    //logger.trace('setVisibility', visibility);
    visible.value = visibility;

    if (!documentPage.value) return; // Skip when page is not loaded
    if (!visible.value || !needsRedraw) return;
    _updateDebouncer.debounced();
};

watch([() => controller.state.scale], () => {
    if (!documentPage.value) return; // Skip when page is not loaded

    needsRedraw = true;
    if (!visible.value) return;

    if (isFirstDraw) {
        update();
    } else {
        _updateDebouncer.debounced();
    }
});

onMounted(() => {
    logger.debug('Mounted');
    pdf.getPage(idx)
        .then((p) => {
            documentPage.value = p;
            update();
        })
        .catch((reason) => {
            logger.warn('Could not get page', reason);
        });

    useIntersectionObserver(
        container.value!,
        controller.viewportElement,
        (entries) => {
            entries.forEach((entry) => {
                setVisibility(entry.isIntersecting);
            });
        }
    );
});

onUnmounted(() => {
    logger.debug('Unmounted');
    reset();
    cleanup();
});
</script>

<template>
    <div
        :id="`page-${idx}`"
        ref="container"
        :style="{
            width: `${viewport?.width}px`,
            height: `${viewport?.height}px`,
        }"
        class="pdf-viewer-page"
    >
        <div class="canvas-wrapper">
            <canvas ref="canvas" />
        </div>
        <TextLayer
            v-if="controller.options.showTextLayer"
            :page="documentPage"
            :viewport="viewport"
        />
    </div>
</template>

<style scoped>
.pdf-viewer-page {
    display: flex;
    justify-content: center;
    position: relative;

    .canvas-wrapper {
        overflow: hidden;
        width: 100%;
        height: 100%;

        background-color: white;
    }

    canvas {
        position: absolute;
        top: 0;
        left: 0;
        margin: 0;
        display: block;
        width: 100%;
        height: 100%;
        contain: content;
    }
}
</style>
