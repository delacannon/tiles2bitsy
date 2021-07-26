import { Command } from "commander";
import { Converter } from "../utils/Converter";
import path from "path";
import fs from "fs/promises";

export interface CustomImage {
  img: string;
  imageData: ImageData;
  name: string;
  str: string;
}

const outputImages = (images: CustomImage[], options): string => {
  const { allAssets, sprites } = options;
  const types: string[] = ["TIL", "SPR", "ITM"];
  let img: string = "";

  if (!allAssets) {
    img = `${images
      .map((img) => {
        return `${sprites ? `SPR` : `TIL`} ${img.name} 
${img.str
  .split("")
  .map((pixel, i) => (i % 8 == 0 && i !== 0 ? `\n${pixel}` : pixel))
  .join("")}\nNAME ${img.name.toLowerCase()}\n\n`;
      })
      .join("")}`;
  } else {
    for (let i: number = 0; i < types.length; i++) {
      img += `${images
        .map((img) => {
          return `${types[i]} ${img.name} 
${img.str
  .split("")
  .map((pixel, i) => (i % 8 == 0 && i !== 0 ? `\n${pixel}` : pixel))
  .join("")}\nNAME ${img.name.toLowerCase()}\n\n`;
        })
        .join("")}`;
    }
  }
  return img;
};

export const serveCommand = new Command()
  .command("generate <filnemane>")
  .alias("g")
  .option("-s, --sprites", "Create sprites (default are tiles)", false)
  .option(
    "-a, --all-assets",
    "Create tiles, sprites and items from the image source",
    false
  )
  .option(
    "-n, --no-gamesource",
    "Remove all default gamesource and output the images data only",
    true
  )
  .description("Convert an image to bitsy data")
  .action(
    async (
      filename,
      options = { sprites: Boolean, gamesource: Boolean, allAssets: Boolean }
    ) => {
      const dirPath = path.join(process.cwd(), path.dirname(filename));

      try {
        console.log("Processing image...");
        const converter = new Converter();
        await converter.getFile(`${dirPath}/${path.basename(filename)}`);

        const images = outputImages(converter.getAllImages, options);

        const txt = `Write your game's title here

# BITSY VERSION 7.6
			
! ROOM_FORMAT 1

PAL 0
NAME blueprint
0,82,204
128,159,255
255,255,255

ROOM 0
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
0,a,a,a,a,a,a,a,a,a,a,a,a,a,a,0
0,a,0,0,0,0,0,0,0,0,0,0,0,0,a,0
0,a,0,0,0,0,0,0,0,0,0,0,0,0,a,0
0,a,0,0,0,0,0,0,0,0,0,0,0,0,a,0
0,a,0,0,0,0,0,0,0,0,0,0,0,0,a,0
0,a,0,0,0,0,0,0,0,0,0,0,0,0,a,0
0,a,0,0,0,0,0,0,0,0,0,0,0,0,a,0
0,a,0,0,0,0,0,0,0,0,0,0,0,0,a,0
0,a,0,0,0,0,0,0,0,0,0,0,0,0,a,0
0,a,0,0,0,0,0,0,0,0,0,0,0,0,a,0
0,a,0,0,0,0,0,0,0,0,0,0,0,0,a,0
0,a,0,0,0,0,0,0,0,0,0,0,0,0,a,0
0,a,0,0,0,0,0,0,0,0,0,0,0,0,a,0
0,a,a,a,a,a,a,a,a,a,a,a,a,a,a,0
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
NAME example room
PAL 0

TIL a
11111111
10000001
10000001
10011001
10011001
10000001
10000001
11111111
NAME block

${images}

SPR A
00011000
00011000
00011000
00111100
01111110
10111101
00100100
00100100
POS 0 4,4

SPR a
00000000
00000000
01010001
01110001
01110010
01111100
00111100
00100100
NAME cat
DLG 0
POS 0 8,12

ITM 0
00000000
00000000
00000000
00111100
01100100
00100100
00011000
00000000
NAME tea
DLG 1

ITM 1
00000000
00111100
00100100
00111100
00010000
00011000
00010000
00011000
NAME key
DLG 2

DLG 0
I'm a cat
NAME cat dialog

DLG 1
You found a nice warm cup of tea
NAME tea dialog

DLG 2
A key! {wvy}What does it open?{wvy}
NAME key dialog

VAR a
42


`;

        await fs.writeFile("gamedata.txt", options.gamesource ? txt : images);
        console.log(
          `DONE!! Generated a new bitsy gamedata at:\n${dirPath}/gamedata.txt`
        );
      } catch (err) {
        console.log(err);
        process.exit(1);
      }
    }
  );
