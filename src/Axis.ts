import Scale from "./scale/Scale";

// type AxisDomain = number | string | Date | { valueOf(): number};
// D extends AxisDomain?

interface IRenderable {
    render(ctx: CanvasRenderingContext2D): void
}

export class Axis<D> implements IRenderable {
    constructor(scale: Scale<D, number>) {
        this.scale = scale;
    }

    scale: Scale<D, number>;

    translation: [number, number] = [0, 0];
    rotation: number = 0; // radians

    lineWidth: number = 1;
    tickWidth: number = 1;
    tickSize: number = 6;
    tickPadding: number = 5;
    lineColor: string = 'black';
    tickColor: string = 'black';
    labelFont: string = '14px Verdana';
    labelColor: string = 'black';

    // To translate or rotate the axis the ctx can be transformed prior to render
    render(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(...this.translation);
        ctx.rotate(this.rotation);

        const scale = this.scale;

        // Render ticks and labels.
        {
            const ticks = scale.ticks!(10);
            const bandwidth = (scale.bandwidth || 0) / 2;
            const tickCount = ticks.length;
            const pxShift = -this.tickWidth % 2 / 2;
            ctx.lineWidth = this.tickWidth;
            ctx.strokeStyle = this.tickColor;
            ctx.fillStyle = this.labelColor;
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.font = this.labelFont;
            ctx.beginPath();
            for (let i = 0; i < tickCount; i++) {
                const r = scale.convert(ticks[i]) - this.tickWidth / 2 + bandwidth;
                ctx.moveTo(-this.tickSize, r + pxShift);
                ctx.lineTo(0, r + pxShift);
                ctx.fillText(ticks[i].toString(), -this.tickSize - this.tickPadding, r);
            }
            ctx.stroke();
        }

        // Render axis line.
        {
            const pxShift = -this.lineWidth % 2 / 2;
            ctx.lineWidth = this.lineWidth;
            ctx.strokeStyle = this.lineColor;
            ctx.beginPath();
            ctx.moveTo(pxShift, scale.range[0]);
            ctx.lineTo(pxShift, scale.range[scale.range.length - 1]);
            ctx.stroke();
        }


        ctx.restore();
    }
}