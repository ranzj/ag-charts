import Scale from './Scale';

export class BandScale<D> implements Scale<D, number> {
    _domain: D[] = [];
    set domain(values: D[]) {
        const domain = this._domain;
        const index = this.index;

        domain.length = 0;
        index.clear();

        values.forEach(value => {
            if (!index.has(value)) {
                index.set(value, domain.push(value) - 1);
            }
        });
    }
    get domain(): D[] {
        return this._domain;
    }

    _range: [number, number] = [0, 1];
    set range(values: [number, number]) {
        this._range[0] = values[0];
        this._range[1] = values[1];
        this.rescale();
    }
    get range(): [number, number] {
        return this._range;
    }

    convert(d: D): number {
        let i = this.index.get(d);
        if (i === undefined) return NaN;
        const r = this.ordinalRange[i];
        if (r === undefined) return NaN;
        return r;
    }

    private ordinalRange: number[] = [];

    private index = new Map<D, number>();

    _bandwidth: number = 1;
    get bandwidth(): number {
        return this._bandwidth;
    }

    _padding = 0;
    set padding(value: number) {
        value = Math.max(0, Math.min(1, value));
        this._paddingInner = value;
        this._paddingOuter = value;
        this.rescale();
    }
    get padding(): number {
        return this._paddingInner;
    }

    /**
     * The ratio of the range that is reserved for space between bands.
     */
    _paddingInner = 0;
    set paddingInner(value: number) {
        this._paddingInner = Math.max(0, Math.min(1, value)); // [0, 1]
        this.rescale();
    }
    get paddingInner(): number {
        return this._paddingInner;
    }

    /**
     * The ratio of the range that is reserved for space before the first
     * and after the last band.
     */
    _paddingOuter = 0;
    set paddingOuter(value: number) {
        this._paddingOuter = Math.max(0, Math.min(1, value)); // [0, 1]
        this.rescale();
    }
    get paddingOuter(): number {
        return this._paddingOuter;
    }

    _round = false;
    set round(value: boolean) {
        this._round = value;
        this.rescale();
    }
    get round(): boolean {
        return this._round;
    }

    /**
     * How the leftover range is distributed.
     * `0.5` - equal distribution of space before the first and after the last band,
     * with bands effectively centered within the range.
     */
    _align = 0.5;
    set align(value: number) {
        this._align = Math.max(0, Math.min(1, value)); // [0, 1]
        this.rescale();
    }
    get align(): number {
        return this._align;
    }

    protected rescale() {
        const n = this._domain.length;
        if (!n) return;
        let [a, b] =  this._range;
        const isReverse = b < a;
        if (isReverse) [a, b] = [b, a];
        let step = (b - a) / Math.max(1, n - this._paddingInner + this._paddingOuter * 2);
        if (this._round) step = Math.floor(step);
        a += (b - a - step * (n - this._paddingInner)) * this._align;
        this._bandwidth = step * (1 - this._paddingInner);
        if (this._round) {
            a = Math.round(a);
            this._bandwidth = Math.round(this._bandwidth);
        }
        const values = Array.from({length: n}, (_, i) => a + step * i);
        this.ordinalRange = isReverse ? values.reverse() : values;
    }
}