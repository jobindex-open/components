import { debounce } from '../../src/lib/util';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('debounce', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    it('should call the function after the delay', () => {
        const fn = vi.fn();
        const { debounced } = debounce(fn, 1000);

        debounced();
        expect(fn).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1000);
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should reset the timer if called again before delay', () => {
        const fn = vi.fn();
        const { debounced } = debounce(fn, 1000);

        debounced();
        vi.advanceTimersByTime(500);
        debounced(); // reset
        vi.advanceTimersByTime(500);
        expect(fn).not.toHaveBeenCalled();

        vi.advanceTimersByTime(500);
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should call the function after maxWait even with repeated calls', () => {
        const fn = vi.fn();
        const { debounced } = debounce(fn, 500, 2000);

        for (let i = 0; i < 4; i++) {
            debounced();
            vi.advanceTimersByTime(400); // keep resetting
        }

        expect(fn).not.toHaveBeenCalled();
        vi.advanceTimersByTime(400); // total 2000ms
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should not call the function if cancel is called before delay', () => {
        const fn = vi.fn();
        const { debounced, cancel } = debounce(fn, 1000);

        debounced();
        cancel();
        vi.advanceTimersByTime(1000);
        expect(fn).not.toHaveBeenCalled();
    });

    it('should use default delay if none is provided', () => {
        const fn = vi.fn();
        const { debounced } = debounce(fn); // default 500ms

        debounced();
        vi.advanceTimersByTime(499);
        expect(fn).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1);
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should not set maxTimer if maxWait is not provided', () => {
        const fn = vi.fn();
        const { debounced } = debounce(fn, 500);

        debounced();
        for (let i = 0; i < 5; i++) {
            vi.advanceTimersByTime(400);
            debounced();
        }

        vi.advanceTimersByTime(500);
        expect(fn).toHaveBeenCalledTimes(1);
    });
});
