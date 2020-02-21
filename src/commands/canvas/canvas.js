module.exports = {
  description: 'Chaos.',
  parameters: [
    {
      name: 'url',
      type: String
    }
  ],
  async execute (client, message, args) {
    const imageURL = message.attachments.first() ? message.attachments.first().url : args[0];
    const image = await client.canvas.loadImage(imageURL);

    const canvas = client.canvas.createCanvas(image.width, image.height);
    const context = canvas.getContext('2d');

    context.drawImage(image, 0, 0);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let prevR = 0;
    let prevG = 0;
    let prevB = 0;

    function diff (prev, curr) {
      return Math.abs(Math.round(curr - prev));
    }

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const v = diff(prevR, r) ^ diff(prevG, g) ^ diff(prevB, b);

      data[i] = prevR * ((r ^ v) >> args[0]);
      data[i + 1] = prevG * ((g ^ v) >> args[0]);
      data[i + 2] = prevB * ((b ^ v) >> args[0]);

      prevR = r;
      prevG = g;
      prevB = b;
    }

    context.putImageData(imageData, 0, 0);

    return message.channel.send(new client.discord.MessageAttachment(canvas.toBuffer()));
  }
};