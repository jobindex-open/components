<script setup lang="ts">
import PDFPage from './viewer/PDFPage.vue';
import ToolBar from './toolbar/ToolBar.vue';
import {
    useViewController,
    type ViewController,
} from '../composables/use-view-controller';

import { usePDF } from '../composables/use-pdf';
import PDFViewport from './viewer/PDFViewport.vue';
import { onMounted, onUnmounted, watch, type Ref, type ShallowRef } from 'vue';
import LoadingSpinner from './util/LoadingSpinner.vue';
import { HORIZONTAL_PADDING, VERTICAL_PADDING } from '../lib/constants';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { init, configureWorker } from '../lib/pdfjs';

interface PDFViewerProps {
    pdf:
        | {
              pdf: ShallowRef<PDFDocumentProxy | undefined>;
              loading: Ref<boolean>;
              progress: Ref<number>;
          }
        | string;
    pdfjsWorker?: string;
    controller?: ViewController;
}

const props = defineProps<PDFViewerProps>();

if (props.pdfjsWorker) {
    configureWorker(props.pdfjsWorker);
} else {
    init();
}

const { pdf, loading, progress } =
    typeof props.pdf === 'string' ? usePDF(props.pdf) : props.pdf;

const controller = props.controller ?? useViewController();

watch(pdf, () => {
    if (!pdf.value) return;
    controller.pdf = pdf;
    controller.pageCount.value = pdf.value.numPages;

    pdf.value
        .getPage(1)
        .then((page) => {
            controller.firstPage.value = page;
        })
        .catch(() => {});
});

// Make sure to set fullscreen state correctly
const fullscreenChangeHandler = () => {
    if (document.fullscreenElement) return;
    controller.state.isFullscreen = false;
};

onMounted(() => {
    document.addEventListener('fullscreenchange', fullscreenChangeHandler);
});

onUnmounted(() => {
    document.removeEventListener('fullscreenchange', fullscreenChangeHandler);
});
</script>

<template>
    <div class="pdf-viewer">
        <div
            :class="{
                'pdf-viewer-container': true,
                fullscreen: controller.state.isFullscreen,
            }"
        >
            <slot name="toolbar">
                <ToolBar :controller />
            </slot>
            <div class="pdf-viewer-overlay">
                <slot name="overlay">
                    <LoadingSpinner v-if="loading" :progress />
                </slot>
            </div>
            <PDFViewport v-if="!loading && pdf" :controller>
                <div
                    class="pdf-viewer-page-list"
                    :style="{
                        padding: `${VERTICAL_PADDING}px ${HORIZONTAL_PADDING}px`,
                        gap: `${VERTICAL_PADDING}px`,
                    }"
                >
                    <PDFPage
                        v-for="i in pdf.numPages"
                        :key="i"
                        :controller
                        :idx="i"
                        :pdf="pdf"
                    />
                </div>
            </PDFViewport>
        </div>
    </div>
</template>

<style>
.pdf-viewer {
    background-color: rgb(25, 25, 25);
    color: white;

    .pdf-viewer-container {
        height: 100%;
        width: 100%;

        display: flex;
        flex-direction: column;
        position: relative;

        /*&.fullscreen {
            padding-top: 60px;
            @media screen and (min-width: 480px) {
                padding-top: 0;
            }
        }*/
    }

    .pdf-viewer-overlay {
        position: absolute;

        width: 100%;
        height: 100%;
        pointer-events: none;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .pdf-viewer-page-list {
        display: flex;
        flex-direction: column;
    }
}
</style>
