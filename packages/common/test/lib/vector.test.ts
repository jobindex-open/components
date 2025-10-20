import { expect, test } from 'vitest';
import { Vector } from '../../src';

test.each([
    [
        { x: 1, y: 2 },
        { x: 3, y: 4 },
        { x: 4, y: 6 },
    ],
    [
        { x: 100, y: 100 },
        { x: 200, y: -50 },
        { x: 300, y: 50 },
    ],
    [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
    ],
    [
        { x: -5, y: 10 },
        { x: 5, y: -10 },
        { x: 0, y: 0 },
    ],
    [
        { x: -3, y: -7 },
        { x: -2, y: -8 },
        { x: -5, y: -15 },
    ],
    [
        { x: 1.5, y: 2.5 },
        { x: 3.5, y: 4.5 },
        { x: 5.0, y: 7.0 },
    ],
    [
        { x: 999999, y: 888888 },
        { x: 111111, y: 222222 },
        { x: 1111110, y: 1111110 },
    ],
])('Vector.add(%o, %o) -> %o', (a, b, expected) => {
    expect(Vector.add(a, b)).toStrictEqual(expected);
});

test.each([
    [
        { x: 5, y: 7 },
        { x: 2, y: 3 },
        { x: 3, y: 4 },
    ],
    [
        { x: 100, y: 50 },
        { x: 50, y: 100 },
        { x: 50, y: -50 },
    ],
    [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
    ],
    [
        { x: -10, y: 5 },
        { x: -5, y: 10 },
        { x: -5, y: -5 },
    ],
    [
        { x: 3, y: 3 },
        { x: 6, y: 6 },
        { x: -3, y: -3 },
    ],
    [
        { x: 4.5, y: 2.5 },
        { x: 1.5, y: 1.0 },
        { x: 3.0, y: 1.5 },
    ],
    [
        { x: 1000000, y: 500000 },
        { x: 999999, y: 499999 },
        { x: 1, y: 1 },
    ],
])('Vector.subtract(%o, %o) -> %o', (a, b, expected) => {
    expect(Vector.subtract(a, b)).toStrictEqual(expected);
});

test.each([
    [{ x: 10, y: 20 }, 2, { x: 5, y: 10 }],
    [{ x: -15, y: 30 }, 5, { x: -3, y: 6 }],
    [{ x: 0, y: 0 }, 10, { x: 0, y: 0 }],
    [{ x: 9, y: -3 }, 3, { x: 3, y: -1 }],
    [{ x: 4.5, y: 1.5 }, 1.5, { x: 3, y: 1 }],
    [{ x: 1000000, y: 500000 }, 1000, { x: 1000, y: 500 }],
])('Vector.divide(%o, %f) -> %o', (a, s, expected) => {
    expect(Vector.divide(a, s)).toStrictEqual(expected);
});

test.each([
    [{ x: 3, y: 4 }, 5],
    [{ x: 0, y: 0 }, 0],
    [{ x: 1, y: 1 }, Math.sqrt(2)],
    [{ x: -3, y: -4 }, 5],
    [{ x: 5.5, y: 2.5 }, Math.sqrt(5.5 ** 2 + 2.5 ** 2)],
])('Vector.magnitude(%o) -> %f', (vec, expected) => {
    expect(Vector.magnitude(vec)).toBeCloseTo(expected);
});

test.each([
    [{ x: 0, y: 0 }, { x: 3, y: 4 }, 5],
    [{ x: 1, y: 1 }, { x: 1, y: 1 }, 0],
    [{ x: -1, y: -1 }, { x: 1, y: 1 }, Math.sqrt(8)],
    [{ x: 2.5, y: 4.5 }, { x: 1.5, y: 1.5 }, Math.sqrt(10)],
    [{ x: 1000, y: 1000 }, { x: 0, y: 0 }, Math.sqrt(2000000)],
])('Vector.distance(%o, %o) -> %f', (a, b, expected) => {
    expect(Vector.distance(a, b)).toBeCloseTo(expected);
});

test.each([
    [
        { x: 0, y: 0 },
        { x: 2, y: 2 },
        { x: 1, y: 1 },
    ],
    [
        { x: -1, y: -1 },
        { x: 1, y: 1 },
        { x: 0, y: 0 },
    ],
    [
        { x: 3, y: 5 },
        { x: 7, y: 9 },
        { x: 5, y: 7 },
    ],
    [
        { x: 2.5, y: 4.5 },
        { x: 1.5, y: 1.5 },
        { x: 2, y: 3 },
    ],
    [
        { x: 1000, y: 2000 },
        { x: 3000, y: 4000 },
        { x: 2000, y: 3000 },
    ],
])('Vector.midPoint(%o, %o) -> %o', (a, b, expected) => {
    expect(Vector.midPoint(a, b)).toStrictEqual(expected);
});
