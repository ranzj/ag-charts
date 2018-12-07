interface IRenderable {
    render(ctx: CanvasRenderingContext2D): void
}

export default class Image implements IRenderable {
    constructor(src: string = '') {
        this.src = src;
    }

    _src: string = '';

    x: number = 0;
    y: number = 0;
    width?: number;
    height?: number;

    set src(url: string) {
        url && fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const img = document.createElement('img');
                img.src = URL.createObjectURL(blob);
                Image.cache.set(url, img);
                this._src = url;
            })
            .catch(reason => console.warn(reason));
    }
    get src(): string {
        return this._src;
    }

    private static cache = new Map<string, HTMLImageElement>();

    render(ctx: CanvasRenderingContext2D): void {
        const image = Image.cache.get(this._src);
        if (image) {
            ctx.drawImage(image, this.x, this.y,
                this.width || image.naturalWidth,
                this.height || image.naturalHeight);
        }
    }
}