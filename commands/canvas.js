module.exports = {
  name: 'canvas',
  description: 'Canvas',
  usage: '[scale]',
  args: true,
  async execute (client, message, args) {
    const scale = parseInt(args[0]);
    const canvas = client.canvas.createCanvas(scale, scale);
    const ctx = canvas.getContext('2d');

    var imgData = ctx.createImageData(canvas.width, canvas.height);

    for (var i = 0; i < imgData.data.length; i += 4) {
      imgData.data[i + 0] = Math.random() * 255;
      imgData.data[i + 1] = Math.random() * 255;
      imgData.data[i + 2] = Math.random() * 255;
      imgData.data[i + 3] = 255;
    }

    ctx.putImageData(imgData, 10, 10);

    const attachment = new client.discord.MessageAttachment(canvas.toBuffer());
    message.channel.send(attachment);
  }
};
