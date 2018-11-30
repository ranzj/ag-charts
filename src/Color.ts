export default class Color {
    r = 0;
    g = 0;
    b = 0;
    a = 0;

    constructor(r: number, g: number, b: number, a: number = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    clone(): Color {
        return new Color(this.r, this.g, this.b, this.a);
    }


}