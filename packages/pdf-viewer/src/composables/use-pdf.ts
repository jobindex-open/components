import { onMounted, onUnmounted, ref, shallowRef } from 'vue';
import {
    getDocument,
    type PDFDocumentProxy,
    type OnProgressParameters,
    type PDFDocumentLoadingTask,
} from 'pdfjs-dist';
import { createLogger } from '@jobindex/lib';

export const usePDF = (path: string) => {
    const logger = createLogger({ name: 'usePDF' });

    const loading = ref(false);
    const progress = ref(0.0);
    const pageCount = ref(0);
    const pdf = shallowRef<PDFDocumentProxy | undefined>();

    let loadingTask: PDFDocumentLoadingTask | undefined;

    onMounted(() => {
        logger.debug('Mounted');
        logger.info(`Loading PDF document from ${path}`);
        loadingTask = getDocument(path);

        loading.value = true;
        loadingTask.onProgress = (prog: OnProgressParameters) => {
            logger.debug(`PDF loading progress ${prog.loaded} / ${prog.total}`);
            progress.value = prog.loaded / prog.total;
        };

        loadingTask.promise
            .then((document) => {
                loading.value = false;
                pdf.value = document;
                pageCount.value = document.numPages;

                logger.info('Document loaded');
                logger.debug('Document loaded', {
                    numPages: document.numPages,
                });
            })
            .catch(() => {
                // Loading task cancelled
                logger.debug('Loading task cancelled', { path });
            });
    });

    onUnmounted(() => {
        logger.debug('Unmounted');
        if (loadingTask) loadingTask.destroy().catch(() => {});
        if (pdf.value) pdf.value.destroy().catch(() => {});
    });

    return { pdf, pageCount, loading, progress };
};
