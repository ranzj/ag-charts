import { createHdpiCanvas } from "./HdpiCanvas";

test("createHdpiCanvas", async () => {
    await page.setViewport({ width: 800, height: 600, deviceScaleFactor: 2 });
    let size = await page.evaluate(() => {
        const canvas = document.createElement('canvas'); // createHdpiCanvas();
        return [canvas.width, canvas.height];
    });
    console.log(size); // [300, 150]
});

describe('Google', () => {
    beforeAll(async () => {
        await page.goto('https://google.com')
    });

    it('should display "google" text on page', async () => {
        await expect(page).toMatch('google')
    })
});