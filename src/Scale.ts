import * as d3 from 'd3';
import {Color} from "d3";

// const i = d3.scaleLinear().domain([0, 1]).range(['red', 'green']); // perfectly valid JS
// const i = d3.scaleLinear<string>().domain([0, 1]).range(['red', 'green']);
//
// type INumeric = number | { valueOf(): number }; // Symbol.valueOf essentially
//
// export interface ScaleContinuousNumeric1<I, O> {
//     (value: INumeric): O;
//
//     invert(value: INumeric): number;
//
//     // domain: INumeric[]; // always of type INumeric[]
//
//     domain(): number[];
//     domain(domain: INumeric[]): this;
//
// }
//
//
// function ScaleContinuous(value: INumeric) {
//
// }
// ScaleContinuous.invert = function (value: INumeric) { return 0; };
// ScaleContinuous.domain = function (domain: INumeric[]) {
//     return this;
// };

// const fff: ScaleContinuousNumeric1 = ScaleContinuous;

// class Hello {
//     [Symbol.iterator]() {
//
//     }
// }

// export interface ScaleContinuousNumeric2<D, R> {
//     convert(value: number): R;
//     invert(value: R): number;
//     domain: number[];
//     domain(domain: number[]): this;
// }

/*

 d3.scaleLinear

export default function linear() {
  var scale = continuous(deinterpolate, reinterpolate);

  scale.copy = function() {
    return copy(scale, linear());
  };

  return linearish(scale);
  // linearish takes a continuous scale and mixes in `ticks`, `nice` and other methods
}

 */

type Reinterpolator<T> = (t: number) => T;
type Deinterpolator<T> = (v: T) => number;

type ReinterpolatorFactory<T> = (a: T, b: T) => Reinterpolator<T>;
type DeinterpolatorFactory<T> = (a: T, b: T) => Deinterpolator<T>;

type PiecewiseReinterpolatorFactory<T> = (a: number[], b: T[], de: DeinterpolatorFactory<number>, re: ReinterpolatorFactory<T>) => Reinterpolator<T>;
type PiecewiseDeinterpolatorFactory<T> = (a: T[], b: number[], de: DeinterpolatorFactory<T>, re: ReinterpolatorFactory<number>) => Deinterpolator<T>;


interface Scale<D, R> {
    _domain: D[];
    _range: R[];
    convert(value: D): R;
}

abstract class ContinuousScale<R> implements Scale<number, R> {
    private reinterpolatorFactory: ReinterpolatorFactory<R>;
    private deinterpolatorFactory?: DeinterpolatorFactory<R>;
    private rangeComparator?: Comparator<R>;

    private piecewiseReinterpolatorFactory?: PiecewiseReinterpolatorFactory<R>;
    private piecewiseReinterpolator?: Reinterpolator<R>;

    private piecewiseDeinterpolatorFactory?: PiecewiseDeinterpolatorFactory<R>;
    private piecewiseDeinterpolator?: Deinterpolator<R>;

    constructor(reinterpolatorFactory: ReinterpolatorFactory<R>,
                deinterpolatorFactory?: DeinterpolatorFactory<R>,
                rangeComparator?: Comparator<R>) {
        this.reinterpolatorFactory = reinterpolatorFactory;
        this.deinterpolatorFactory = deinterpolatorFactory;
        this.rangeComparator = rangeComparator;
    }

    _domain: number[] = [0, 1];
    _range: R[] = [];

    set domain(d: number[]) {
        this._domain = d.slice();
        this.rescale();
    }

    get domain(): number[] {
        return this._domain;
    }

    set range(r: R[]) {
        this._range = r.slice();
        this.rescale();
    }

    get range(): R[] {
        return this._range;
    }

    clamp: boolean = false;

    convert(d: number): R {
        if (!this.piecewiseReinterpolator) {
            if (!this.piecewiseReinterpolatorFactory) {
                throw new Error('Missing piecewiseReinterpolatorFactory');
            }
            const deinterpolatorFactory = this.clamp
                ? this.clampDeinterpolatorFactory(this.deinterpolatorOf)
                : this.deinterpolatorOf;
            this.piecewiseReinterpolator = this.piecewiseReinterpolatorFactory(this._domain, this._range,
                deinterpolatorFactory, this.reinterpolatorFactory);
        }
        if (!this.piecewiseReinterpolator) throw new Error('Missing piecewiseReinterpolator');
        return this.piecewiseReinterpolator(d);
    }

    invert(r: R): number {
        if (!this.deinterpolatorFactory) throw new Error('Missing deinterpolatorFactory');
        if (!this.piecewiseDeinterpolator) {
            if (!this.piecewiseDeinterpolatorFactory) {
                throw new Error('Missing piecewiseDeinterpolatorFactory');
            }
            const reinterpolatorFactory = this.clamp
                ? this.clampReinterpolatorFactory(this.reinterpolatorOf)
                : this.reinterpolatorOf;
            this.piecewiseDeinterpolator = this.piecewiseDeinterpolatorFactory(this._range, this._domain,
                this.deinterpolatorFactory, reinterpolatorFactory);
        }
        return this.piecewiseDeinterpolator(r);
    }

    protected abstract deinterpolatorOf(a: number, b: number): Deinterpolator<number>
    protected abstract reinterpolatorOf(a: number, b: number): Reinterpolator<number>

    protected clampDeinterpolatorFactory(deinterpolatorOf: DeinterpolatorFactory<number>): DeinterpolatorFactory<number> {
        return (a, b) => {
            const deinterpolate = deinterpolatorOf(a, b);
            return (x) => {
                if (x <= a) {
                    return 0.0;
                } else if (x >= b) {
                    return 1.0;
                } else {
                    return deinterpolate(x);
                }
            }
        };
    }

    protected clampReinterpolatorFactory(reinterpolatorOf: ReinterpolatorFactory<number>): ReinterpolatorFactory<number> {
        return (a, b) => {
            const reinterpolate = reinterpolatorOf(a, b);
            return (t) => {
                if (t <= 0) {
                    return a;
                } else if (t >= 1) {
                    return b;
                } else {
                    return reinterpolate(t);
                }
            }
        };
    }

    protected rescale() {
        const isPoly = Math.min(this._domain.length, this._range.length) > 2;
        this.piecewiseReinterpolatorFactory = isPoly ? this.polymap : this.bimap;
        this.piecewiseDeinterpolatorFactory = isPoly ? this.polymapInvert : this.bimapInvert;
        this.piecewiseDeinterpolator = undefined;
        this.piecewiseReinterpolator = undefined;
    }

    private bimap(domain: number[], range: R[],
                  deinterpolatorOf: DeinterpolatorFactory<number>,
                  reinterpolatorOf: ReinterpolatorFactory<R>): Reinterpolator<R> {
        const d0 = domain[0];
        const d1 = domain[1];
        const r0 = range[0];
        const r1 = range[1];

        let dt: Deinterpolator<number>;
        let tr: Reinterpolator<R>;

        if (d1 < d0) {
            dt = deinterpolatorOf(d1, d0);
            tr = reinterpolatorOf(r1, r0);
        } else {
            dt = deinterpolatorOf(d0, d1);
            tr = reinterpolatorOf(r0, r1);
        }

        return (x) => tr(dt(x));
    }

    private bimapInvert(range: R[], domain: number[],
                        deinterpolatorOf: DeinterpolatorFactory<R>,
                        reinterpolatorOf: ReinterpolatorFactory<number>): Deinterpolator<R> {
        const r0 = range[0];
        const r1 = range[1];
        const d0 = domain[0];
        const d1 = domain[1];

        let rt: Deinterpolator<R>;
        let td: Reinterpolator<number>;

        if (d1 < d0) {
            rt = deinterpolatorOf(r1, r0);
            td = reinterpolatorOf(d1, d0);
        } else {
            rt = deinterpolatorOf(r0, r1);
            td = reinterpolatorOf(d0, d1);
        }

        return (x) => td(rt(x));
    }

    private polymap(domain: number[], range: R[],
                    deinterpolatorOf: DeinterpolatorFactory<number>,
                    reinterpolatorOf: ReinterpolatorFactory<R>): Reinterpolator<R> {

        let d: number[];
        let r: R[];

        if (domain.slice(-1)[0] < domain[0]) {
            d = domain.reverse();
            r = range.reverse();
        } else {
            d = domain;
            r = range;
        }

        // number of segments in the polylinear scale
        const n = Math.min(domain.length, range.length) - 1;
        // deinterpolators from domain segment value to t
        const dt = Array.from( {length: n}, (_, i) => deinterpolatorOf(d[i], d[i+1]) );
        // reinterpolators from t to range segment value
        const tr = Array.from( {length: n}, (_, i) => reinterpolatorOf(r[i], r[i+1]) );

        return (x) => {
            const i = bisect(d, x, naturalOrder, 1, n) - 1; // Find the domain segment that `x` belongs to.
            // This also tells us which deinterpolator/reinterpolator pair to use.
            return tr[i](dt[i](x));
        }
    }

    private polymapInvert(range: R[], domain: number[],
                          deinterpolatorOf: DeinterpolatorFactory<R>,
                          reinterpolatorOf: ReinterpolatorFactory<number>): Deinterpolator<R> {
        let r: R[];
        let d: number[];

        if (domain.slice(-1)[0] < domain[0]) {
            r = range.reverse();
            d = domain.reverse();
        } else {
            r = range;
            d = domain;
        }

        const n = Math.min(domain.length, range.length) - 1;
        const rt = Array.from( {length: n}, (_, i) => deinterpolatorOf(r[i], r[i+1]) );
        const td = Array.from( {length: n}, (_, i) => reinterpolatorOf(d[i], d[i+1]) );

        return (x) => {
            if (!this.rangeComparator) throw new Error('Missing rangeComparator');
            const i = bisect(r, x, this.rangeComparator, 1, n) - 1;
            return td[i](rt[i](x));
        }
    }
}

type Comparator<T> = (a: T, b: T) => number;

function naturalOrder(a: number, b: number): number {
    return a - b;
}

function bisect<T>(list: T[], x: T, comparator: Comparator<T>, lo: number = 0, hi: number = list.length): number {
    return bisectRight(list, x, comparator, lo, hi)
}

function bisectRight<T>(list: T[], x: T, comparator: Comparator<T>, low: number = 0, high: number = list.length): number {
    let lo = low;
    let hi = high;
    while (lo < hi) {
        const mid = (lo + hi) / 2;
        if (comparator(list[mid], x) > 0)
            hi = mid;
        else
            lo = mid + 1;
    }
    return lo;
}

export function reinterpolateNumber(a: number, b: number): Reinterpolator<number> {
    const d = b - a;
    return t => a + d * t;
}

export class LinearScale<R> extends ContinuousScale<R> {
    protected deinterpolatorOf(a: number, b: number): Deinterpolator<number> {
        const d = b - a;
        if (d === 0 || isNaN(d))
            return () => d;
        else
            return x => (x - a) / d;
    }

    protected reinterpolatorOf(a: number, b: number): Reinterpolator<number> {
        const d = b - a;
        return t => a + d * t;
    }
}