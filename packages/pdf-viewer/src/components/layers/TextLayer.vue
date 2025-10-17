<script setup lang="ts">
import { createLogger, debounce } from '@jobindex/lib';
import { type PageViewport, type PDFPageProxy, TextLayer } from 'pdfjs-dist';
import { onUnmounted, useTemplateRef, watch } from 'vue';

const props = defineProps<{
    page?: PDFPageProxy;
    viewport?: PageViewport;
}>();

const logger = createLogger({
    name: `TextLayer`,
});

const layerContainer = useTemplateRef('layerContainer');
let textLayer: TextLayer | undefined;

let isFirstDraw = true;

const render = async () => {
    logger.debug('render requested');
    if (!props.page || !props.viewport || !layerContainer.value) return;

    if (textLayer) {
        textLayer.cancel();
        textLayer.update({
            viewport: props.viewport,
        });

        return;
    }

    const textContent = await props.page.getTextContent();
    textLayer = new TextLayer({
        textContentSource: textContent,
        container: layerContainer.value,
        viewport: props.viewport,
    });

    await textLayer.render();
};

const reset = () => {
    if (textLayer) {
        textLayer.cancel();
        textLayer = undefined;
    }
};

const renderDebouncer = debounce(() => {
    render().catch(() => {});
});

watch(
    () => props.viewport,
    () => {
        if (isFirstDraw) {
            render().catch(() => {});
            isFirstDraw = false;
        } else {
            renderDebouncer.debounced();
        }
    }
);

onUnmounted(() => {
    reset();
});
</script>

<template>
    <div ref="layerContainer" class="pdf-viewer-page-text-layer" />
</template>

<style>
.pdf-viewer-page-text-layer {
    position: absolute;
    text-align: initial;
    inset: 0;
    overflow: clip;
    opacity: 1;
    line-height: 1;
    text-size-adjust: none;
    forced-color-adjust: none;
    transform-origin: 0 0;
    caret-color: CanvasText;
    z-index: 0;

    &.highlighting {
        touch-action: none;
    }

    :is(span, br) {
        color: transparent;
        position: absolute;
        white-space: pre;
        cursor: text;
        transform-origin: 0% 0%;
    }

    > :not(.markedContent),
    .markedContent span:not(.markedContent) {
        z-index: 1;
    }

    /* Only necessary in Google Chrome, see issue 14205, and most unfortunately
   * the problem doesn't show up in "text" reference tests. */
    /*#if !MOZCENTRAL*/
    span.markedContent {
        top: 0;
        height: 0;
    }
    /*#endif*/

    span[role='img'] {
        user-select: none;
        cursor: default;
    }

    .highlight {
        --highlight-bg-color: rgb(180 0 170 / 0.25);
        --highlight-selected-bg-color: rgb(0 100 0 / 0.25);
        --highlight-backdrop-filter: none;
        --highlight-selected-backdrop-filter: none;

        @media screen and (forced-colors: active) {
            --highlight-bg-color: transparent;
            --highlight-selected-bg-color: transparent;
            --highlight-backdrop-filter: var(--hcm-highlight-filter);
            --highlight-selected-backdrop-filter: var(
                --hcm-highlight-selected-filter
            );
        }

        margin: -1px;
        padding: 1px;
        background-color: var(--highlight-bg-color);
        backdrop-filter: var(--highlight-backdrop-filter);
        border-radius: 4px;

        &.appended {
            position: initial;
        }

        &.begin {
            border-radius: 4px 0 0 4px;
        }

        &.end {
            border-radius: 0 4px 4px 0;
        }

        &.middle {
            border-radius: 0;
        }

        &.selected {
            background-color: var(--highlight-selected-bg-color);
            backdrop-filter: var(--highlight-selected-backdrop-filter);
        }
    }

    ::selection {
        /* stylelint-disable declaration-block-no-duplicate-properties */
        /*#if !MOZCENTRAL*/
        background: rgba(0 0 255 / 0.25);
        /*#endif*/
        /* stylelint-enable declaration-block-no-duplicate-properties */
        background: color-mix(in srgb, AccentColor, transparent 75%);
    }

    /* Avoids https://github.com/mozilla/pdf.js/issues/13840 in Chrome */
    /*#if !MOZCENTRAL*/
    br::selection {
        background: transparent;
    }
    /*#endif*/

    .endOfContent {
        display: block;
        position: absolute;
        inset: 100% 0 0;
        z-index: 0;
        cursor: default;
        user-select: none;
    }

    &.selecting .endOfContent {
        top: 0;
    }
}
</style>
