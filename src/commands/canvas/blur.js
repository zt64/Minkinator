module.exports = {
  description: "Blur an image.",
  async execute (client, message, args) {
    const imageURL = args[0];
    const image = await global.canvas.loadImage(imageURL).catch(() => { return message.channel.send("Invalid URL provided."); });

    const canvas = global.canvas.createCanvas(image.width, image.height);
    const context = canvas.getContext("2d");

    context.blur(30);
    context.drawImage(image, 0, 0);

    const attachment = new global.Discord.MessageAttachment(canvas.toBuffer());

    return message.channel.send(attachment);
  }
};
