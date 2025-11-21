import { useIntersectionObserver } from '@src/composables/use-intersectionobserver';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, test, vi, expect } from 'vitest';
import { defineComponent, ref } from 'vue';

describe('use-intersectionobserver', () => {
    const targetElement = document.createElement('div');
    const containerElement = document.createElement('div');

    const target = ref<HTMLElement | null>(null);
    const container = ref<HTMLElement | null>(null);
    const callback = vi.fn();

    const TestComponent = defineComponent({
        setup() {
            useIntersectionObserver(target, container, callback);
            return {};
        },
        render() {
            return '';
        },
    });

    const IntersectionObserverMock = vi.fn(
        class {
            disconnect = vi.fn();
            observe = vi.fn();
        }
    );

    beforeEach(() => {
        vi.resetAllMocks();
        vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

        target.value = targetElement;
        container.value = containerElement;
    });

    test('the intersection observer is created and target is observed', () => {
        mount(TestComponent);

        expect(IntersectionObserver).toHaveBeenCalledWith(callback, {
            root: container.value,
        });
        const instance = IntersectionObserverMock.mock.instances[0];

        expect(instance?.observe).toHaveBeenCalledWith(target.value);
    });

    test('disconnects old observer when container changes', async () => {
        const wrapper = mount(TestComponent);

        const firstInstance = IntersectionObserverMock.mock.instances[0];

        expect(firstInstance?.disconnect).not.toHaveBeenCalled();

        // Change container to trigger watch
        container.value = document.createElement('div');

        // Wait for watch to event
        await wrapper.vm.$nextTick();

        expect(firstInstance?.disconnect).toHaveBeenCalled();
    });

    test('disconnects observer on component unmount', async () => {
        IntersectionObserverMock.mockReset(); // FIXME: this should not be neccessary
        expect(IntersectionObserverMock.mock.instances.length).toBe(0);

        const wrapper = mount(TestComponent);
        const observerInstance = IntersectionObserverMock.mock.instances[0];

        expect(observerInstance?.disconnect).not.toHaveBeenCalled();
        wrapper.unmount();

        await wrapper.vm.$nextTick();

        expect(observerInstance?.disconnect).toHaveBeenCalled();
    });

    test('does not create observer if target is null', () => {
        target.value = null;

        mount(TestComponent);

        expect(IntersectionObserver).not.toHaveBeenCalled();
        expect(IntersectionObserverMock.mock.instances.length).toBe(0);
    });

    test('does not create observer if container is null', () => {
        container.value = null;

        mount(TestComponent);

        expect(IntersectionObserver).not.toHaveBeenCalled();
        expect(IntersectionObserverMock.mock.instances.length).toBe(0);
    });
});
