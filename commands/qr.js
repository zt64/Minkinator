module.exports = {
  name: 'qr',
  description: 'Generates a QR code based on an input string.',
  usage: '[string]',
  args: true,
  async execute (client, message, args) {
    const canvas = client.canvas.createCanvas(512, 512);

    await client.qr.toCanvas(canvas, args.join(' '), { margin: 2 });

    return message.channel.send(new client.discord.MessageAttachment(canvas.toBuffer()));
  }
};
