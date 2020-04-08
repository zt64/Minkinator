module.exports = {
  description: 'Generates a QR code based on an input string.',
  parameters: [
    {
      name: 'string',
      type: String,
      required: true
    }
  ],
  async execute (client, message, args) {
    const canvas = client.canvas.createCanvas(512, 512);

    await client.qr.toCanvas(canvas, args.join(' '), { margin: 2 });

    return message.channel.send(new client.Discord.MessageAttachment(canvas.toBuffer()));
  }
};