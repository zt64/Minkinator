const { createCanvas, loadImage } = require("canvas");

module.exports = {
  description: "Rotate an image.",
  parameters: [
    {
      name: "url",
      type: String,
      required: true
    },
    {
      name: "degrees",
      type: Number,
      required: true
    },
  ],
  async execute (client, message, [ imageURL, degrees ]) {
    const image = await loadImage(imageURL).catch(() => { return message.reply("Invalid URL provided."); });

    const radians = parseFloat(degrees) * Math.PI / 180;

    const canvas = createCanvas(image.width, image.height);
    const context = canvas.getContext("2d");

    context.translate(image.width / 2, image.height / 2);
    context.rotate(radians);
    context.translate(-image.width / 2, -image.height / 2);
    context.drawImage(image, 0, 0);

    return message.reply(new Discord.MessageAttachment(canvas.toBuffer()));
  }
};
