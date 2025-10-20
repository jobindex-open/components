import { expect, test } from 'vitest';
import { clamp, round } from '../../src/lib/math';

test.each([
    [5, 1, 10, 5],
    [5, 1, 3, 3],
    [5, 7, 10, 7],
])('clamp(%i, %i, %i) -> %i', (val, min, max, expected) => {
    expect(clamp(val, min, max)).toBe(expected);
});

test.each([
    [123.0, 0, 123.0],
    [123.5, 0, 124.0],
    [123.49, 0, 123.0],
    [123.321, 0, 123.0],
    [123.321, 1, 123.3],
    [123.321, 2, 123.32],
    [123.321, 3, 123.321],
    [123.321, -1, 120.0],
    [123.321, -2, 100.0],
])('round(%f, %i) -> %f', (val, precision, expected) => {
    expect(round(val, precision)).toBe(expected);
});
