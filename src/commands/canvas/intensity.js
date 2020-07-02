module.exports = {
  description: "Modifys an images intensity.",
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
  async execute (client, message, args) {
    const imageURL = args[0];
    const image = await client.canvas.loadImage(imageURL);

    const canvas = client.canvas.createCanvas(image.width, image.height);
    const context = canvas.getContext("2d");

    context.drawImage(image, 0, 0);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const factor = parseInt(args[1]);

    for (let i = 0; i < data.length; i += 4) {
      data[i] += factor;
      data[i + 1] += factor;
      data[i + 2] += factor;
    }

    context.putImageData(imageData, 0, 0);

    return message.channel.send(new client.Discord.MessageAttachment(canvas.toBuffer()));
  }
};