import Scale from "./Scale";

export class OrdinalScale<D, R> implements Scale<D, R> {
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

    _range: R[] = [];
    set range(values: R[]) {
        this._range = values.slice();
    }
    get range(): R[] {
        return this._range;
    }

    convert(value: D): R {
        let i = this.index.get(value);
        if (i === undefined) {
            if (this.unknown !== undefined) return this.unknown;
            // implicit domain construction
            this.index.set(value, i = this._domain.push(value) - 1);
        }
        return this._range[i % this._range.length];
    }

    private index = new Map<D, number>();

    /**
     * If {@link unknown} is set, the {@link convert} returns the `unknown`, if the value passed to `convert` is
     * not in the domain. If `unknown` is not set (default), and the value passed to the `convert` is not in
     * the domain, it is added to the domain.
     */
    unknown?: R;
}
