import { Command } from "commander";
import { Converter } from "../utils/Converter";
import path from "path";
import fs from "fs/promises";

export const serveCommand = new Command()
  .command("generate [filnemane]")
  .alias("g")
  .action(async (filename) => {
    const dirPath = path.join(process.cwd(), path.dirname(filename));

    try {
      const converter = new Converter();
      await converter.getFile(`${dirPath}/${path.basename(filename)}`);

      const images = converter.getImages();

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

${images
  .map((img) => {
    return `TIL ${img[2].name}
${img[2].str
  .split("")
  .map((e, i) => (i % 8 == 0 && i !== 0 ? `\n${e}` : e))
  .join("")}\nNAME ${img[2].name.toLowerCase()}\n\n`;
  })
  .join("")}

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
      await fs.writeFile("gamedata.bitsy", txt);
      console.log("Done! Generated a new gamedata.bitsy");
    } catch (err) {
      console.log(err);
    }
  });
