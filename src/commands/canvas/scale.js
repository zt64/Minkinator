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
    const image = await global.canvas.loadImage(imageURL).catch(() => { return message.channel.send("Invalid URL provided."); }); 

    xFactor = parseFloat(xFactor);
    yFactor = parseFloat(yFactor);

    const canvas = global.canvas.createCanvas(image.width * xFactor, image.height * yFactor);
    const context = canvas.getContext("2d");

    context.scale(xFactor, yFactor);
    context.drawImage(image, 0, 0);

    const attachment = new global.Discord.MessageAttachment(canvas.toBuffer());

    return message.channel.send(attachment);
  }
};
