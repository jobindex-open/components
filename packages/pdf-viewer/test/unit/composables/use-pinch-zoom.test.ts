import { describe, test, expect, vi, beforeEach } from 'vitest';
import { type Ref, ref, defineComponent } from 'vue';
import { usePinchZoom } from '@src/composables/use-pinch-zoom';
import { mount } from '@vue/test-utils';

describe('usePinchZoom', () => {
    let container: Ref<HTMLElement>;

    const MockViewController = vi.fn(() => ({
        baseScale: ref(1),
        setScale: vi.fn(),
        zoomIn: vi.fn(),
    }));

    beforeEach(() => {
        vi.resetAllMocks();
        container = ref(document.createElement('div'));
    });

    const createTouch = (id: number, x: number, y: number): Touch => {
        return {
            identifier: id,
            clientX: x,
            clientY: y,
            target: container.value!,
        } as Touch;
    };

    const createTouchEvent = (
        type: string,
        touches: Touch[],
        changedTouches?: Touch[]
    ) => {
        return new TouchEvent(type, {
            touches,
            changedTouches: changedTouches || touches,
        });
    };

    test('should initialize with default values', () => {
        const controller = MockViewController();
        const { isPinchZooming, origin } = usePinchZoom(container, controller);
        expect(isPinchZooming.value).toBe(false);
        expect(origin.value).toEqual({ x: 0, y: 0 });
    });

    test('should detect pinch zoom start when two touches are added', () => {
        const controller = MockViewController();

        const TestComponent = defineComponent({
            setup() {
                const { isPinchZooming } = usePinchZoom(container, controller);
                return { isPinchZooming };
            },
            render() {
                return '';
            },
        });

        const wrapper = mount(TestComponent);

        const t1 = createTouch(1, 10, 10);
        const t2 = createTouch(2, 20, 20);

        container.value.dispatchEvent(createTouchEvent('touchstart', [t1]));
        container.value.dispatchEvent(createTouchEvent('touchstart', [t2]));

        expect(wrapper.vm.isPinchZooming).toBe(true);
    });

    test('should call controller.setScale on pinch move', () => {
        const controller = MockViewController();

        const TestComponent = defineComponent({
            setup() {
                const { isPinchZooming } = usePinchZoom(container, controller);
                return { isPinchZooming };
            },
            render() {
                return '';
            },
        });

        const wrapper = mount(TestComponent);

        // await wrapper.vm.$nextTick();

        const t1 = createTouch(1, 10, 10);
        const t2 = createTouch(2, 20, 20);

        container.value.dispatchEvent(createTouchEvent('touchstart', [t1]));
        container.value.dispatchEvent(createTouchEvent('touchstart', [t2]));

        expect(wrapper.vm.isPinchZooming).toBe(true);

        // Simulate pinch move (increase distance)
        const t1Move = createTouch(1, 10, 10);
        const t2Move = createTouch(2, 40, 40);

        container.value.dispatchEvent(
            createTouchEvent('touchmove', [t1Move, t2Move])
        );

        expect(controller.setScale).toHaveBeenCalledWith({
            mode: 'absolute',
            absoluteScale: 3, // FIXME: should probably check if arg is larger than 1 and not exactly 3
        });
        // const args = controller.setScale.mock.calls[0][0];
        // expect(args.mode).toBe('absolute');
        // expect(args.absoluteScale).toBeGreaterThan(1);
    });

    test('should call zoomIn on double tap', () => {
        const controller = MockViewController();

        const TestComponent = defineComponent({
            setup() {
                const { isPinchZooming } = usePinchZoom(container, controller);
                return { isPinchZooming };
            },
            render() {
                return '';
            },
        });

        mount(TestComponent);

        const t1 = createTouch(1, 10, 10);

        container.value.dispatchEvent(createTouchEvent('touchstart', [t1]));
        container.value.dispatchEvent(createTouchEvent('touchend', [t1]));

        // Second tap within 300ms
        container.value.dispatchEvent(createTouchEvent('touchstart', [t1]));
        container.value.dispatchEvent(createTouchEvent('touchend', [t1]));

        expect(controller.zoomIn).toHaveBeenCalled();
    });
});
