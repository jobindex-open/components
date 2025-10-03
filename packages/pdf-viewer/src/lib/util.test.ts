import { expect, test } from 'vitest';
import { clamp } from './util';

test('clamp 5 between 1 and 10 equals 5', () => {
    expect(clamp(5, 1, 10)).toBe(5);
});
test('clamp 5 between 1 and 3 equals 3', () => {
    expect(clamp(5, 1, 3)).toBe(3);
});
test('clamp 5 between 7 and 10 equals 7', () => {
    expect(clamp(5, 7, 10)).toBe(7);
});
