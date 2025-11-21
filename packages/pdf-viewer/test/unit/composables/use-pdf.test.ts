import { describe, test, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { usePDF } from '@src/composables';
import { getDocument, type PDFDocumentLoadingTask } from 'pdfjs-dist';

describe('usePDF', () => {
    type MockLoadingTask = {
        promise: Promise<unknown>;
        onProgress: (params: { loaded: number; total: number }) => void;
        destroy: () => Promise<void>;
    };

    let mockTask: MockLoadingTask;
    let mockDocument: { numPages: number; destroy: () => Promise<void> };

    // Mock pdfjs-dist
    vi.mock('pdfjs-dist', async () => {
        /**
         * Use a legacy import here to prevent DOMMatrix undefined error
         *
         * @see https://github.com/mozilla/pdf.js/discussions/19847#discussioncomment-13101813
         */
        const mod = await import('pdfjs-dist/legacy/build/pdf.mjs');

        return {
            ...mod,
            getDocument: vi.fn(),
        };
    });

    // Mock logger
    vi.mock('@jobindex/common/lib/logger.ts', () => ({
        createLogger: () => ({
            debug: vi.fn(),
            info: vi.fn(),
        }),
    }));

    beforeEach(() => {
        vi.resetAllMocks();

        mockDocument = {
            numPages: 5,
            destroy: vi.fn().mockResolvedValue(undefined),
        };

        mockTask = {
            promise: Promise.resolve(mockDocument),
            destroy: vi.fn().mockResolvedValue(undefined),
            onProgress: () => {},
        };

        vi.mocked(getDocument).mockReturnValue(
            mockTask as unknown as PDFDocumentLoadingTask
        );
    });

    const createWrapper = (path = '/fake/path.pdf') =>
        mount(
            defineComponent({
                setup() {
                    return usePDF(path);
                },
                template: `<div></div>`,
            })
        );

    test('initial state is correct', () => {
        const wrapper = createWrapper();
        const { pdf, pageCount, loading, progress } = wrapper.vm;

        expect(pdf).toBeUndefined();
        expect(pageCount).toBe(0);
        expect(loading).toBe(true);
        expect(progress).toBe(0);
    });

    test('loads PDF on mount and updates state', async () => {
        const wrapper = createWrapper();

        expect(wrapper.vm.loading).toBe(true);
        expect(wrapper.vm.pdf).toBeUndefined();

        await mockTask.promise;
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.loading).toBe(false);
        expect(wrapper.vm.pdf).toEqual(mockDocument);
        expect(wrapper.vm.pageCount).toBe(5);
    });

    test('progress updates when onProgress is called', async () => {
        const wrapper = createWrapper();
        mockTask.onProgress({ loaded: 50, total: 100 });
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.progress).toBe(0.5);
    });

    test('cleans up on unmount', async () => {
        const wrapper = createWrapper();
        await mockTask.promise;
        await wrapper.vm.$nextTick();

        wrapper.unmount();
        await wrapper.vm.$nextTick();

        expect(mockTask.destroy).toHaveBeenCalled();
        expect(mockDocument.destroy).toHaveBeenCalled();
    });
});
