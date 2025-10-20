/**
 * Clamp a value between a lower and an upper bound
 *
 * @param value - The value to clamp
 * @param min - The lower bound (inclusive)
 * @param max - The upper bound (inclusive)
 */
export const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
};

/**
 * Round a number with a level of precision
 *
 * @param value - The value to round
 * @param precision - The level of precision to use, 0 rounds to whole numbers, 1 rounds to tenth decimal, 2 rounds to hundreth decimal and so on
 */
export const round = (value: number, precision: number = 0) => {
    const multiplier = Math.pow(10, precision);
    return Math.round(value * multiplier) / multiplier;
};
