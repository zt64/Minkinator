const { createCanvas, loadImage } = require("canvas");

module.exports = {
  description: "Change an images scale.",
  parameters: [
    {
      name: "url",
      type: String,
      required: true
    },
    {
      name: "x factor",
      type: Number,
      required: true
    },
    {
      name: "y factor",
      type: Number,
      required: true
    }
  ],
  async execute (client, message, [ imageURL, xFactor, yFactor ]) {
    const image = await loadImage(imageURL).catch(() => { return message.reply("Invalid URL provided."); });

    xFactor = parseFloat(xFactor);
    yFactor = parseFloat(yFactor);

    const canvas = createCanvas(image.width * xFactor, image.height * yFactor);
    const context = canvas.getContext("2d");

    context.scale(xFactor, yFactor);
    context.drawImage(image, 0, 0);

    const attachment = new Discord.MessageAttachment(canvas.toBuffer());

    return message.reply(attachment);
  }
};
