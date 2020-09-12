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
    const image = await global.canvas.loadImage(imageURL).catch(() => { return message.channel.send("Invalid URL provided."); }); 

    const radians = parseFloat(degrees) * Math.PI / 180;

    const canvas = global.canvas.createCanvas(image.width, image.height);
    const context = canvas.getContext("2d");

    context.translate(image.width / 2, image.height / 2);
    context.rotate(radians);
    context.translate(-image.width / 2, -image.height / 2);
    context.drawImage(image, 0, 0);

    const attachment = new global.Discord.MessageAttachment(canvas.toBuffer());

    return message.channel.send(attachment);
  }
};
