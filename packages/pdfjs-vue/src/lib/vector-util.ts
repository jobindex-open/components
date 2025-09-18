import type { Vector2D } from 'src/types';

export const add = (vecA: Vector2D, vecB: Vector2D): Vector2D => {
    return {
        x: vecA.x + vecB.x,
        y: vecA.y + vecB.y,
    };
};

export const subtract = (vecA: Vector2D, vecB: Vector2D): Vector2D => {
    return {
        x: vecA.x - vecB.x,
        y: vecA.y - vecB.y,
    };
};

export const divide = (vec: Vector2D, scalar: number): Vector2D => {
    return {
        x: vec.x / scalar,
        y: vec.y / scalar,
    };
};

export const magnitude = (vec: Vector2D): number => {
    return Math.sqrt(Math.pow(vec.x, 2) + Math.pow(vec.y, 2));
};

export const distance = (vecA: Vector2D, vecB: Vector2D): number => {
    const difference = subtract(vecA, vecB);
    return magnitude(difference);
};

export const midPoint = (vecA: Vector2D, vecB: Vector2D) => {
    return divide(add(vecA, vecB), 2);
};
