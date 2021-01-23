const { createCanvas, loadImage } = require("canvas");

module.exports = {
  description: "Filters an images RGB channels according to a threshold. Does not support .webp images.",
  aliases: ["t"],
  parameters: [
    {
      name: "url",
      type: String,
      required: true
    },
    {
      name: "factor",
      type: Number,
      required: true
    }
  ],
  async execute (client, message, [ imageURL, threshold ]) {
    const image = await loadImage(imageURL).catch(() => { return message.channel.send("Invalid URL provided."); });

    const canvas = createCanvas(image.width, image.height);
    const context = canvas.getContext("2d");

    context.drawImage(image, 0, 0);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const { data } = imageData;

    threshold = parseInt(threshold);

    // Modify pixel data
    for (let i = 0; i < data.length; i += 4) {
      var r = data[i];
      var g = data[i + 1];
      var b = data[i + 2];

      r = r >= threshold ? r : 0;
      g = g >= threshold ? g : 0;
      b = b >= threshold ? b : 0;

      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
    }

    context.putImageData(imageData, 0, 0);

    return message.channel.send(new Discord.MessageAttachment(canvas.toBuffer()));
  }
};