import type { TimerHandle } from '../types';

export const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
};

export const round = (value: number, precision: number = 0) => {
    const multiplier = Math.pow(10, precision);
    return Math.round(value * multiplier) / multiplier;
};

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
