module.exports = {
  description: "Generates a QR code using the input.",
  parameters: [
    {
      name: "input",
      required: true
    }
  ],
  async execute (client, message, args) {
    const canvas = client.canvas.createCanvas(512, 512);

    // Generate QR code
    await client.qr.toCanvas(canvas, args.join(" "), { margin: 2 });

    return message.channel.send(new client.Discord.MessageAttachment(canvas.toBuffer()));
  }
};