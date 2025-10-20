import { createLogger } from '@jobindex/common/lib/logger.ts';
import * as pdfjs from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min?url';

const logger = createLogger({ name: 'pdf-viewer::pdfjs' });

export const configureWorker = (worker: string) => {
    pdfjs.GlobalWorkerOptions.workerSrc = worker;
};

export const init = () => {
    logger.info('Initializing pdfjs lib');
    configureWorker(pdfjsWorker);
};

export { pdfjsWorker };
