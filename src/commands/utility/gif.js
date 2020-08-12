module.exports = {
  description: "Generates a gif",
  async execute (client, message, args) {
    const gif = new client.GifEncoder(512, 512, { highWaterMark: 6.4e+7 });
    const { randomInteger } = client.functions;

    const frames = 16;

    gif.pipe(client.fs.createWriteStream("img.gif"));

    gif.setRepeat(0);

    gif.writeHeader();

    // Set pixel data
    for (let i = 0; i < frames; i++) {
      const r = randomInteger(0, 255);
      const g = randomInteger(0, 255);
      const b = randomInteger(0, 255);

      var pixels = [];

      for (let j = 0; j < gif.width; j++) {
        for (let k = 0; k < gif.height; k++) {
          pixels.push(r); // R
          pixels.push(g); // G
          pixels.push(b); // B
          pixels.push(255); // A
        }
      }

      gif.addFrame(pixels);
    }

    gif.finish();
  }
};