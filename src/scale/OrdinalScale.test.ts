import {OrdinalScale} from "./OrdinalScale";

test('populating domain', () => {
    const scale = new OrdinalScale();
    scale.convert('B');
    scale.convert('C');
    scale.convert('A');

    expect(scale.domain).toEqual(['B', 'C', 'A']);
});