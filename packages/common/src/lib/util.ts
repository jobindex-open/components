import type { TimerHandle } from '../types';

/**
 * Debounce a function
 *
 * @param fn - The function to debounce
 * @param delay - The amount of delay before the function is invoked
 * @param maxWait - The max amount of time to wait before the function should be invoked, even if new calls are being made
 * @returns An object containing the invoking function: `debounced()`, and a function to cancel ongoing timers: `cancel()`
 */
export const debounce = (
    fn: () => void,
    delay: number = 500,
    maxWait?: number
) => {
    let timer: TimerHandle;
    let maxTimer: TimerHandle;

    const _cancelTimer = () => {
        if (timer) clearTimeout(timer);
        timer = undefined;
    };

    const _cancelMaxTimer = () => {
        if (maxTimer) clearTimeout(maxTimer);
        maxTimer = undefined;
    };

    const cancel = () => {
        _cancelTimer();
        _cancelMaxTimer();
    };

    const _invoke = () => {
        fn();
        cancel();
    };

    const debounced = () => {
        if (!maxTimer && maxWait) maxTimer = setTimeout(_invoke, maxWait);
        if (timer) _cancelTimer();
        timer = setTimeout(_invoke, delay);
    };

    return { debounced, cancel };
};
