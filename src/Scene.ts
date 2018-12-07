import {createHdpiCanvas, resizeCanvas} from "./HdpiCanvas";

export default class Scene {
    constructor(parent: HTMLElement, width = 800, height = 600) {
        this._width = width;
        this._height = height;
        this.canvas = createHdpiCanvas(width, height);
        parent.appendChild(this.canvas);
    }

    private readonly canvas: HTMLCanvasElement;

    _width: number;
    get width(): number {
        return this._width;
    }

    _height: number;
    get height(): number {
        return this._height;
    }

    set size(value: [number, number]) {
        resizeCanvas(this.canvas, ...value);
        [this._width, this._height] = value;
    }
}