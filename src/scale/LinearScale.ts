import {Deinterpolator, Reinterpolator} from "./Scale";
import ContinuousScale from "./ContinuousScale";

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