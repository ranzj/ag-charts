import {types} from "util";

abstract class Sprite {

}

interface IRenderable {
    render(ctx: CanvasRenderingContext2D): void
}

interface ISprite extends IRenderable {

}

class Rect implements IRenderable {
    x: number = 0;
    y: number = 0;
    width: number = 8;
    height: number = 8;
    radius: number = 8;

    render(ctx: CanvasRenderingContext2D): void {
    }
}