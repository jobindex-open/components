import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min?url';
import { configureWorker, init } from '../../../src/lib/pdfjs';
import { describe, test, expect, vi, beforeEach } from 'vitest';

// Mock the logger
vi.mock('@jobindex/common/lib/logger.ts', () => ({
    createLogger: vi.fn(() => ({
        info: vi.fn(),
    })),
}));

// Mock pdfjs-dist and its worker
let mockWorkerSrcValue: string = '';
const mockSetWorkerSrc = vi.fn((val: string) => {
    mockWorkerSrcValue = val;
});
const mockGetWorkerSrc = vi.fn(() => mockWorkerSrcValue);
vi.mock('pdfjs-dist', () => ({
    GlobalWorkerOptions: {
        get workerSrc() {
            return mockGetWorkerSrc();
        },
        set workerSrc(val: string) {
            mockSetWorkerSrc(val);
        },
    },
}));

vi.mock('pdfjs-dist/build/pdf.worker.min?url', () => ({
    default: 'mock-worker-url',
}));

describe('pdfjs.ts', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('configureWorker sets pdfjs workerSrc', () => {
        configureWorker('custom-worker.js');
        expect(mockSetWorkerSrc).toHaveBeenCalledWith('custom-worker.js');
    });

    test('init logs and sets workerSrc', () => {
        init();
        expect(mockSetWorkerSrc).toHaveBeenCalledWith('mock-worker-url');
    });

    test('pdfjsWorker is exported correctly', () => {
        expect(pdfjsWorker).toBe('mock-worker-url');
    });
});
