## Tiles2bitsy

A simple nodejs client tool to generate bitsy graphics from an image.
It generates a file called gamedata.txt. You can import the file text
content to the gamedata textarea from the Bitsy Editor. Or share the file with others.

Filename image must be an image with .png or .jpg extension.

`
    npx tiles2bitsy generate <filename.png>
`

View all options:

`
    Convert an image to bitsy data

    Options:

    -s, --sprites       Create sprites (default are tiles)
    -a, --all-assets    Create tiles, sprites and items from the image
    -n, --no-gamesource     Remove all boilerplate
    -h, --help           display help for command
`


