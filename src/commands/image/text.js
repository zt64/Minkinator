const { createCanvas } = require("canvas");

module.exports = {
  description: "Creates an image from text.",
  parameters: [
    {
      name: "string",
      type: String,
      required: true
    }
  ],
  async execute (client, message, args) {
    const canvas = createCanvas(512, 512);
    const ctx = canvas.getContext("2d");

    const text = args.join(" ");
    const font = "Arial";
    const size = 32;

    canvas.width = ctx.measureText(text).width * 3;
    canvas.height = size * 3;

    // Set ctx properties
    ctx.font = `${size}px ${font}`;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseLine = "bottom";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const attachment = new Discord.MessageAttachment(canvas.toBuffer());
    return message.reply(attachment);
  }
};