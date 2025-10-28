import { describe, expect, test } from 'vitest';
import {
    isPortrait,
    scaleOptionToAbsolute,
    sortScaleOptions,
} from '../../../src/lib/scale-util.ts';
import type { Size } from '@jobindex/common/types.js';
import type { ScaleOption } from '../../../src/types.ts';
import {
    HORIZONTAL_PADDING,
    SCALE_MAX_AUTO,
    VERTICAL_PADDING,
} from '../../../src/lib/constants.ts';

test.each([
    [{ width: 1920, height: 1080 }, false],
    [{ width: 1080, height: 1920 }, true],
    [{ width: 1920, height: 1920 }, true],
])('isPortrait(%o) -> %s', (size, expected) => {
    expect(isPortrait(size)).toBe(expected);
});

describe('scaleOptionToAbsolute', () => {
    const container: Size = { width: 1000, height: 800 };
    const page: Size = { width: 500, height: 400 };

    test('returns absolute scale when mode is absolute', () => {
        const opt: ScaleOption = { mode: 'absolute', absoluteScale: 1.5 };
        expect(scaleOptionToAbsolute(opt, container, page)).toBe(1.5);
    });

    test('calculates fit-width scale correctly', () => {
        const opt: ScaleOption = { mode: 'fit-width' };
        const expected =
            (container.width - HORIZONTAL_PADDING * 2) / page.width;
        expect(scaleOptionToAbsolute(opt, container, page)).toBeCloseTo(
            expected
        );
    });

    test('calculates fit-height scale correctly', () => {
        const opt: ScaleOption = { mode: 'fit-height' };
        const expected =
            (container.height - VERTICAL_PADDING * 2) / page.height;
        expect(scaleOptionToAbsolute(opt, container, page)).toBeCloseTo(
            expected
        );
    });

    test('calculates auto scale for portrait page', () => {
        const portraitPage: Size = { width: 400, height: 800 };
        const opt: ScaleOption = { mode: 'auto' };
        const expected =
            (container.width - HORIZONTAL_PADDING * 2) / portraitPage.width;
        expect(scaleOptionToAbsolute(opt, container, portraitPage)).toBeCloseTo(
            Math.min(SCALE_MAX_AUTO, expected)
        );
    });

    test('calculates auto scale for landscape page', () => {
        const landscapePage: Size = { width: 800, height: 400 };
        const opt: ScaleOption = { mode: 'auto' };
        const widthScale =
            (container.width - HORIZONTAL_PADDING * 2) / landscapePage.width;
        const heightScale =
            (container.height - VERTICAL_PADDING * 2) / landscapePage.height;
        const expected = Math.min(
            SCALE_MAX_AUTO,
            Math.min(widthScale, heightScale)
        );
        expect(
            scaleOptionToAbsolute(opt, container, landscapePage)
        ).toBeCloseTo(expected);
    });

    test('respects custom padding', () => {
        const opt: ScaleOption = { mode: 'fit-width' };
        const padding: Size = { width: 50, height: 30 };
        const expected = (container.width - 2 * padding.width) / page.width;
        expect(
            scaleOptionToAbsolute(opt, container, page, padding)
        ).toBeCloseTo(expected);
    });
});

describe('sortScaleOptions', () => {
    test('sorts absolute scales numerically', () => {
        const a: ScaleOption = { mode: 'absolute', absoluteScale: 1 };
        const b: ScaleOption = { mode: 'absolute', absoluteScale: 2 };
        const c: ScaleOption = { mode: 'absolute', absoluteScale: 1 };
        expect(sortScaleOptions(a, b)).toBeLessThan(0);
        expect(sortScaleOptions(b, a)).toBeGreaterThan(0);
        expect(sortScaleOptions(a, c)).equals(0);
    });

    test('places absolute after non-absolute', () => {
        const a: ScaleOption = { mode: 'absolute', absoluteScale: 1 };
        const b: ScaleOption = { mode: 'fit-width' };
        expect(sortScaleOptions(a, b)).toBeGreaterThan(0);
        expect(sortScaleOptions(b, a)).toBeLessThan(0);
    });

    test('sorts non-absolute modes alphabetically', () => {
        const a: ScaleOption = { mode: 'auto' };
        const b: ScaleOption = { mode: 'fit-height' };
        const c: ScaleOption = { mode: 'fit-width' };
        expect(sortScaleOptions(a, b)).toBeLessThan(0);
        expect(sortScaleOptions(b, a)).toBeGreaterThan(0);
        expect(sortScaleOptions(b, c)).toBeLessThan(0);
    });

    test('returns 0 for equal options', () => {
        const a: ScaleOption = { mode: 'fit-width' };
        const b: ScaleOption = { mode: 'fit-width' };
        expect(sortScaleOptions(a, b)).toBe(0);
    });
});
