const qr = require("qrcode");

module.exports = {
  description: "Generates a QR code using the input.",
  parameters: [
    {
      name: "input",
      required: true
    }
  ],
  async execute (client, message, args) {
    const { colors } = global.guildInstance.config;
    const input = args.join(" ");

    const canvas = global.canvas.createCanvas(512, 512);

    await qr.toCanvas(canvas, input, { margin: 2 });

    return message.channel.send(new global.Discord.MessageEmbed({
      color: colors.default,
      title: "QR Code",
      description: input,
      files: [ new global.Discord.MessageAttachment(canvas.toBuffer(), "qr.png") ],
      image: { url: "attachment://qr.png" }
    }));
  }
};