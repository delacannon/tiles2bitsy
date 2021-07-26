import fs from "fs/promises";
import { createCanvas, loadImage, Image, Canvas, ImageData } from "canvas";
import { CustomImage } from "../commands/serve";

export class Converter {
  images: CustomImage[] = [];

  async getFile(filename: string): Promise<void> {
    try {
      // load image
      const result = await fs.readFile(filename, { encoding: "base64" });
      const image: string = `data:image/png;base64,${result}`;
      // process image
      this.renderImage(image);
    } catch (err) {
      console.log(err);
    }
  }

  renderImage(image: string): void {
    const canvas: Canvas = createCanvas(0, 0);
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    loadImage(image).then((img: Image) => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      this.splitImage(canvas);
    });
  }

  crop(
    canvas: Canvas,
    offsetX: number,
    offsetY: number,
    width: number,
    height: number
  ): [string, ImageData] {
    const buffer = createCanvas(0, 0);
    const b_ctx = buffer.getContext("2d");
    buffer.width = width;
    buffer.height = height;

    b_ctx.drawImage(
      canvas,
      offsetX,
      offsetY,
      width,
      height,
      0,
      0,
      buffer.width,
      buffer.height
    );

    return [buffer.toDataURL(), b_ctx.getImageData(0, 0, 8, 8)];
  }

  getColorIndicesForCoord(x: number, y: number) {
    var red = y * (8 * 4) + x * 4;
    return [red, red + 1, red + 2, red + 3];
  }

  splitImage(canvas: Canvas): void {
    for (let x: number = 0; x < canvas.width; x += 8) {
      for (let y: number = 0; y < canvas.height; y += 8) {
        const ref = this.crop(canvas, x, y, 8, 8);
        const d = ref[1].data;
        let str: string = "";
        for (let i = 0; i < d.length; i += 4) {
          var med = (d[i] + d[i + 1] + d[i + 2]) / 3;
          d[i] = d[i + 1] = d[i + 2] = med;
          if (med < 128) {
            str += `0`;
          } else {
            str += `1`;
          }
        }
        this.images.push({
          img: ref[0],
          imageData: ref[1],
          name: `IMG${this.images.length}`,
          str,
        });
      }
    }
  }

  get getAllImages(): CustomImage[] {
    return this.images;
  }
}
