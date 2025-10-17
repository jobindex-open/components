import { createLogger } from '@jobindex/lib';
import * as pdfjs from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min?url';

const logger = createLogger({ name: 'pdfjs' });

export const configureWorker = (worker: string) => {
    pdfjs.GlobalWorkerOptions.workerSrc = worker;
};

export const init = () => {
    logger.info('Initializing pdfjs lib');
    configureWorker(pdfjsWorker);
};

export { pdfjsWorker };
