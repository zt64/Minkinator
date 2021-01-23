const { createCanvas, loadImage } = require("canvas");

module.exports = {
  description: "Inverts an images RGB channels.",
  parameters: [
    {
      name: "url",
      type: String
    }
  ],
  async execute (client, message, [ imageURL ]) {
    if (!(imageURL || message.attachments.size)) return message.channel.send("No URL or attachment provided.");
    const image = await loadImage(imageURL).catch(() => { return message.channel.send("Invalid URL provided."); });

    const canvas = createCanvas(image.width, image.height);
    const context = canvas.getContext("2d");

    context.drawImage(image, 0, 0);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const { data } = imageData;

    // Invert pixels
    for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i] ^ 255;
      data[i + 1] = data[i + 1] ^ 255;
      data[i + 2] = data[i + 2] ^ 255;
    }

    context.putImageData(imageData, 0, 0);

    return message.channel.send(new Discord.MessageAttachment(canvas.toBuffer()));
  }
};