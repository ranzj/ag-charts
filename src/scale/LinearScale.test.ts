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
});