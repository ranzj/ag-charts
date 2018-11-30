import Scale from './Scale';

export class BandScale<D> implements Scale<D, number> {
    _domain: D[] = [];
    _range: number[] = [0, 1];
}