/**
 * Returns the position offset to apply to align vertical and horizontal
 * lines to the pixel grid for crisp look.
 * @param value Typically line width is assumed. Fractional values won't be aligned.
 * @param bias If alignment is necessary, which side to prefer.
 */
export function pixelSnap(value: number, bias: 1 | -1 = 1): number {
    return value % 1 === 0 ? bias * value % 2 / 2 : value;
}

/**
 * Normalize the given angle to [0, 2π) interval.
 * @param angle Angle in radians.
 */
export function normalizeAngle(angle: number): number {
    angle %= Math.PI * 2;
    angle += Math.PI * 2;
    angle %= Math.PI * 2;
    return angle;
}

/**
 * Normalize the given angle to [-π, π) interval.
 * @param angle Angle in radians.
 */
export function normalizeAngle180(angle: number): number {
    angle %= Math.PI * 2;
    if (angle < -Math.PI) {
        angle += Math.PI * 2;
    } else if (angle >= Math.PI) {
        angle -= Math.PI * 2;
    }
    return angle;
}