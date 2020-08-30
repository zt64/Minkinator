module.exports = {
  description: "Generates a QR code using the input.",
  parameters: [
    {
      name: "input",
      required: true
    }
  ],
  async execute (client, message, args) {
    const canvas = global.canvas.createCanvas(512, 512);

    // Generate QR code
    await global.qr.toCanvas(canvas, args.join(" "), { margin: 2 });

    return message.channel.send(new global.Discord.MessageAttachment(canvas.toBuffer()));
  }
};