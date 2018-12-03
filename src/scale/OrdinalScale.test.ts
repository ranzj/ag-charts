import {OrdinalScale} from "./OrdinalScale";

test('implicit unknown (implicit domain construction)', () => {
    const scale = new OrdinalScale();

    expect(scale.convert('B')).toBe(undefined);
    expect(scale.convert('C')).toBe(undefined);
    expect(scale.convert('A')).toBe(undefined);

    expect(scale.domain).toEqual(['B', 'C', 'A']);
    expect(scale.range).toEqual([]);
});

test('explicit unknown', () => {
    const scale = new OrdinalScale();

    scale.unknown = 'Joe';

    expect(scale.convert('B')).toBe('Joe');
    expect(scale.convert('A')).toBe('Joe');

    expect(scale.domain).toEqual([]);
    expect(scale.range).toEqual([]);
});

test('domain/range mapping', () => {
    const scale = new OrdinalScale();

    scale.domain = ['A', 'B', 'C', 'D', 'E'];
    scale.range = [0, 1, 2, 3, 4];

    expect(scale.domain).toEqual(['A', 'B', 'C', 'D', 'E']);
    expect(scale.range).toEqual([0, 1, 2, 3, 4]);

    expect(scale.convert('A')).toBe(0);
    expect(scale.convert('B')).toBe(1);
    expect(scale.convert('C')).toBe(2);
    expect(scale.convert('D')).toBe(3);
    expect(scale.convert('E')).toBe(4);

    expect(scale.convert('X')).toBe(0);
    expect(scale.convert('Y')).toBe(1);
    expect(scale.convert('Z')).toBe(2);

    expect(scale.domain).toEqual(['A', 'B', 'C', 'D', 'E', 'X', 'Y', 'Z']);
    expect(scale.range).toEqual([0, 1, 2, 3, 4]);
});