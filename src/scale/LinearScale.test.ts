import scaleLinear, {LinearScale, reinterpolateNumber} from "./LinearScale";

test('LinearScale', () => {
    const linearScale = scaleLinear();

    linearScale.domain = [-100, 100];
    linearScale.range = [0, 100];

    expect(linearScale.convert(-100)).toBe(0);
    expect(linearScale.convert(0)).toBe(50);
    expect(linearScale.convert(100)).toBe(100);

    expect(linearScale.invert(50)).toBe(0);
    expect(linearScale.invert(0)).toBe(-100);

    // Polylinear scale.

    const polyLinearScale = scaleLinear();

    polyLinearScale.domain = [-1, 0, 1];
    polyLinearScale.range = [0, 100, 300];

    expect(polyLinearScale.convert(-1)).toBe(0);
    expect(polyLinearScale.convert(-0.5)).toBe(50);
    expect(polyLinearScale.convert(0)).toBe(100);
    expect(polyLinearScale.convert(0.5)).toBe(200);
    expect(polyLinearScale.convert(1)).toBe(300);

    expect(polyLinearScale.invert(50)).toBe(-0.5);
    expect(polyLinearScale.invert(100)).toBe(0);
    expect(polyLinearScale.invert(300)).toBe(1);
});