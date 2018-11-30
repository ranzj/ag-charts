import {OrdinalScale} from "./OrdinalScale";

test('populating domain', () => {
    const scale = new OrdinalScale();

    expect(scale.convert('B')).toBe(undefined);
    expect(scale.convert('C')).toBe(undefined);
    expect(scale.convert('A')).toBe(undefined);

    expect(scale.domain).toEqual(['B', 'C', 'A']);
});