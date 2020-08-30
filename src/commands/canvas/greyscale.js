module.exports = {
  description: "Modifies an images RGB channels to be black and white.",
  aliases: ["bw"],
  parameters: [
    {
      name: "url",
      type: String
    }
  ],
  async execute (client, message, args) {
    const imageURL = message.attachments.first() ? message.attachments.first().url : args[0];
    const image = await global.canvas.loadImage(imageURL).catch(() => { return message.channel.send("Invalid URL provided."); });

    const canvas = global.canvas.createCanvas(image.width, image.height);
    const context = canvas.getContext("2d");

    context.drawImage(image, 0, 0);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Change pixels to be grayscale
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const v = 0.21 * r + 0.72 * g + 0.07 * b;

      data[i] = data[i + 1] = data[i + 2] = v;
    }

    context.putImageData(imageData, 0, 0);

    return message.channel.send(new global.Discord.MessageAttachment(canvas.toBuffer()));
  }
};