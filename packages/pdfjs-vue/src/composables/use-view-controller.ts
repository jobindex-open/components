import { computed, reactive, ref, shallowRef } from 'vue';
import {
    SCALE_DEFAULT,
    SCALE_FACTOR,
    SCALE_MAX,
    SCALE_MIN,
    SCALE_OPTIONS,
    SCALE_STEP,
} from '../lib/constants';
import { clamp, round } from '../lib/util';
import type { DeepPartial, ScaleOption } from 'src/types';
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import { scaleOptionToAbsolute, sortScaleOptions } from '../lib/scale-util';
import { createLogger } from '../lib/logger';

interface ViewOptions {
    scale: {
        default: number;
        factor: number;

        min: number;
        max: number;
        step: number;

        options: number[];
    };

    showTextLayer: boolean;
    allowFullscreen: boolean;
}

export type ViewController = ReturnType<typeof viewController>;

const viewController = (config?: DeepPartial<ViewOptions>) => {
    const logger = createLogger({ name: 'ViewController' });

    const appContainer = ref<HTMLDivElement | undefined>();
    const viewportElement = ref<HTMLDivElement | undefined>();

    const pdf = shallowRef<PDFDocumentProxy | undefined>();
    const firstPage = shallowRef<PDFPageProxy | undefined>();
    const pageCount = ref<number>(0);

    const options = reactive({
        scale: {
            default: config?.scale?.default ?? SCALE_DEFAULT,
            factor: config?.scale?.factor ?? SCALE_FACTOR,
            min: config?.scale?.min ?? SCALE_MIN,
            max: config?.scale?.max ?? SCALE_MAX,
            step: config?.scale?.step ?? SCALE_STEP,
            options: config?.scale?.options ?? SCALE_OPTIONS,
        },
        showTextLayer: config?.showTextLayer ?? true,
        allowFullscreen: config?.allowFullscreen ?? true,
    });

    const state = reactive<{
        scale: ScaleOption;
        currentPage: number;
        isFullscreen: boolean;
    }>({
        scale: { mode: 'auto' },
        currentPage: 1,
        isFullscreen: false,
    });

    const defaultScale = computed(
        () => options.scale.default * options.scale.factor
    );

    /**
     * The base scale, based on currently selected scaling mode
     */
    const baseScale = computed(() => {
        if (!viewportElement.value || !firstPage.value) {
            // logger.warn(
            //     'Could not calculate scaling, pdf or viewport might be undefined'
            // );
            return state.scale.mode === 'absolute'
                ? state.scale.absoluteScale
                : options.scale.default;
        }

        const containerSize = {
            width: viewportElement.value.clientWidth,
            height: viewportElement.value.clientHeight,
        };

        const pageViewport = firstPage.value.getViewport({
            scale: defaultScale.value,
        });

        const pageSize = {
            width: pageViewport.width,
            height: pageViewport.height,
        };

        return scaleOptionToAbsolute(state.scale, containerSize, pageSize);
    });

    /**
     * The effective scale (base scale * scale factor)
     */
    const scale = computed(() => baseScale.value * options.scale.factor);

    const setScale = (opt: ScaleOption) => {
        logger.trace('setScale', opt);
        if (opt.mode === 'absolute') {
            if (isNaN(opt.absoluteScale)) {
                logger.error('Cannot set scale to NaN');
                return;
            }
            // Keep scale within bounds
            opt.absoluteScale = clamp(
                opt.absoluteScale,
                options.scale.min,
                options.scale.max
            );
        }

        state.scale = opt;
    };

    const setScaleRel = (s: number) => {
        setScale({
            mode: 'absolute',
            absoluteScale: baseScale.value + s,
        });
    };

    const _zoomBySteps = (n: number = 1) => {
        setScale({
            mode: 'absolute',
            absoluteScale: round(baseScale.value + options.scale.step * n, 1),
        });
    };

    const zoomIn = () => {
        logger.trace('zoomIn');
        _zoomBySteps(1);
    };

    const zoomOut = () => {
        logger.trace('zoomOut');
        _zoomBySteps(-1);
    };

    const resetZoom = () => {
        logger.trace('resetZoom');
        setScale({
            mode: 'absolute',
            absoluteScale: options.scale.default,
        });
    };

    const zoomOptions = computed((): ScaleOption[] => {
        const dynamicOptions: ScaleOption[] = [
            {
                mode: 'auto',
                label: 'Auto',
            },
            {
                mode: 'fit-width',
                label: 'Fit Width',
            },
            {
                mode: 'fit-height',
                label: 'Fit Height',
            },
        ];

        const defaultOptions: ScaleOption[] = SCALE_OPTIONS.map((val) => ({
            mode: 'absolute',
            absoluteScale: val,
        }));

        const scales: ScaleOption[] =
            state.scale.mode !== 'absolute'
                ? defaultOptions
                : defaultOptions.concat([state.scale]).sort(sortScaleOptions);

        return [dynamicOptions, scales].flat().filter((val, index, self) => {
            if (val.mode !== 'absolute') return true;
            return (
                self.findIndex(
                    (v) =>
                        v.mode === 'absolute' &&
                        v.absoluteScale === val.absoluteScale
                ) === index
            );
        });
    });

    const setCurrentPage = (p: number) => {
        state.currentPage = clamp(p, 1, pageCount.value);
    };

    const goToPage = (p: number) => {
        _scrollToPage(p);
    };

    const goToPreviousPage = () => {
        goToPage(state.currentPage - 1);
    };

    const goToNextPage = () => {
        goToPage(state.currentPage + 1);
    };

    const _scrollToPage = (p: number) => {
        logger.trace('_scrollToPage', p);
        const _p = clamp(p, 1, pageCount.value);
        const id = `page-${_p}`;

        if (!viewportElement.value) {
            logger.warn(`Cannot scroll to ${id}, container element not found`);
            return;
        }

        const target = viewportElement.value.querySelector<HTMLDivElement>(
            `#${id}`
        );

        if (!target) {
            logger.warn(`Element with id '${id}' not found`);
            return;
        }

        const targetPosition = target.offsetTop - 16;

        viewportElement.value.scrollTo({
            top: targetPosition,
            behavior: 'smooth',
        });
    };

    const enterFullscreen = () => {
        logger.trace('enterFullScreen');
        if (!options.allowFullscreen) {
            logger.debug('Fullscreen not allowed');
            return;
        }
        if (!appContainer.value) {
            logger.warn('Could not enter fullscreen, app view not found');
            return;
        }
        appContainer.value
            .requestFullscreen()
            .then(() => {
                state.isFullscreen = true;
            })
            .catch(() => {});
    };

    const exitFullscreen = () => {
        logger.trace('exitFullScreen');
        document
            .exitFullscreen()
            .then(() => {
                state.isFullscreen = false;
            })
            .catch(() => {});
    };

    const toggleFullscreen = () => {
        logger.trace('toggleFullScreen');
        if (state.isFullscreen) {
            exitFullscreen();
        } else {
            enterFullscreen();
        }
    };

    logger.info('Initialized');
    return {
        state,
        options,
        pdf,
        pageCount,
        firstPage,
        scale,
        baseScale,
        setScale,
        setScaleRel,
        zoomIn,
        zoomOut,
        resetZoom,
        zoomOptions,
        setCurrentPage,
        goToPage,
        goToPreviousPage,
        goToNextPage,
        enterFullscreen,
        exitFullscreen,
        toggleFullscreen,
        viewportElement,
        appContainer,
    };
};

export const useViewController = (
    config?: DeepPartial<ViewOptions>
): ViewController => viewController(config);
