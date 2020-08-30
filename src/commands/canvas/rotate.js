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
  async execute (client, message, args) {
    const imageURL = args[0];
    const image = await client.canvas.loadImage(imageURL).catch(() => { return message.channel.send("Invalid URL provided."); });

    const radians = parseFloat(args[1]) * Math.PI / 180;

    const canvas = client.canvas.createCanvas(image.width, image.height);
    const context = canvas.getContext("2d");

    context.translate(image.width / 2, image.height / 2);
    context.rotate(radians);
    context.translate(-image.width / 2, -image.height / 2);
    context.drawImage(image, 0, 0);

    const attachment = new client.Discord.MessageAttachment(canvas.toBuffer());

    return message.channel.send(attachment);
  }
};
