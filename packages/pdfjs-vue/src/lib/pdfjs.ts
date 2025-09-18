import * as pdfjs from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min?url';
import { createLogger } from './logger';

const logger = createLogger({ name: 'pdfjs' });

export const configureWorker = (worker: string) => {
    pdfjs.GlobalWorkerOptions.workerSrc = worker;
};

export const init = () => {
    logger.info('Initializing pdfjs lib');
    configureWorker(pdfjsWorker);
};

export { pdfjsWorker };
