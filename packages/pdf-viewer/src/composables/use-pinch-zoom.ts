import { computed, ref, watch, type Ref } from 'vue';
import type { ViewController } from './use-view-controller';
import {
    createLogger,
    Vector,
    type TimerHandle,
    type Vector2D,
} from '@jobindex/lib';

export const usePinchZoom = (
    container: Ref<HTMLElement | undefined>,
    controller: ViewController
) => {
    const logger = createLogger({ name: 'pdf-viewer::usePinchZoom' });

    const scaleDiff = ref<number>(0);

    const touchCache = ref<Touch[]>([]);
    const isPinchZooming = computed(() => touchCache.value.length == 2);

    const origin = ref<Vector2D>({ x: 0, y: 0 });

    let initialScale: number = 0;

    let doubleTapTimer: TimerHandle;

    const _unpackTouchList = (tl: TouchList): Touch[] => {
        const touches = [];

        for (const t of tl) {
            touches.push(t);
        }

        return touches;
    };

    const _touchToVector2D = (t: Touch): Vector2D => {
        return {
            x: t.clientX,
            y: t.clientY,
        };
    };

    const _getTouchDistance = (touchA: Touch, touchB: Touch) => {
        return Vector.distance(
            { x: touchA.clientX, y: touchA.clientY },
            { x: touchB.clientX, y: touchB.clientY }
        );
    };

    const _isDoubleTap = () => {
        const _reset = () => {
            clearTimeout(doubleTapTimer);
            doubleTapTimer = undefined;
        };

        if (doubleTapTimer) {
            _reset();
            return true;
        }

        doubleTapTimer = setTimeout(_reset, 300);
        return false;
    };

    const initialDistance = computed(() => {
        const touchA = touchCache.value[0];
        const touchB = touchCache.value[1];
        if (!touchA || !touchB) {
            return 0;
        }

        return _getTouchDistance(touchA, touchB);
    });

    const startHandler = (ev: TouchEvent) => {
        logger.debug('touchstart', ev);
        for (const touch of ev.changedTouches) {
            touchCache.value.push(touch);
        }

        if (touchCache.value.length == 2) {
            logger.debug('Pinch zoom start');
            initialScale = controller.baseScale.value;
        }
    };

    const endHandler = (ev: TouchEvent) => {
        const changedTouches = _unpackTouchList(ev.changedTouches);

        touchCache.value = touchCache.value.filter(
            (val) => !changedTouches.find((c) => c.identifier == val.identifier)
        );

        if (!isPinchZooming.value && _isDoubleTap()) {
            logger.debug('Double tap');
            controller.zoomIn();
        }
    };

    const moveHandler = (ev: TouchEvent) => {
        if (!isPinchZooming.value) return;
        ev.preventDefault();

        const initialPoint1 = touchCache.value[0];
        const initialPoint2 = touchCache.value[1];

        if (!initialPoint1 || !initialPoint2) return;

        const currentTouches = _unpackTouchList(ev.touches);

        const currentPoint1 = currentTouches.find(
            (val) => val.identifier === initialPoint1.identifier
        );
        const currentPoint2 = currentTouches.find(
            (val) => val.identifier === initialPoint2.identifier
        );

        if (!currentPoint1 || !currentPoint2) return;

        const currentVec1 = _touchToVector2D(currentPoint1);
        const currentVec2 = _touchToVector2D(currentPoint2);

        const newDistance = Vector.distance(currentVec1, currentVec2);

        origin.value = Vector.midPoint(currentVec1, currentVec2);

        controller.setScale({
            mode: 'absolute',
            absoluteScale: initialScale * (newDistance / initialDistance.value),
        });
    };

    watch(container, (el, _old, onCleanup) => {
        if (!el) return;
        el.addEventListener('touchstart', startHandler);
        el.addEventListener('touchend', endHandler);
        el.addEventListener('touchmove', moveHandler);

        onCleanup(() => {
            el.removeEventListener('touchstart', startHandler);
            el.removeEventListener('touchend', endHandler);
            el.removeEventListener('touchmove', moveHandler);
        });
    });

    return { scaleDiff, isPinchZooming, origin };
};
