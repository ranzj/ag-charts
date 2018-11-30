import {BandScale} from "./BandScale";

test('basic bands', () => {
    const scale = new BandScale();

    scale.domain = ['A', 'B', 'C', 'D', 'E'];
    scale.range = [0, 500];

    expect(scale('A')).toBe(0);
    expect(scale('B')).toBe(100);
    expect(scale('C')).toBe(200);
    expect(scale('D')).toBe(300);
    expect(scale('E')).toBe(400);
});