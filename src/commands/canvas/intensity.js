module.exports = {
  description: "Modifies an images intensity.",
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
  async execute (client, message, [ imageURL, factor ]) {
    const image = await global.canvas.loadImage(imageURL).catch(() => { return message.channel.send("Invalid URL provided."); });

    const canvas = global.canvas.createCanvas(image.width, image.height);
    const context = canvas.getContext("2d");

    context.drawImage(image, 0, 0);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const { data } = imageData;

    factor = parseInt(factor);

    // Modify pixel intensity
    for (let i = 0; i < data.length; i += 4) {
      data[i] += factor;
      data[i + 1] += factor;
      data[i + 2] += factor;
    }

    context.putImageData(imageData, 0, 0);

    return message.channel.send(new global.Discord.MessageAttachment(canvas.toBuffer()));
  }
};