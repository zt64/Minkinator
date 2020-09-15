module.exports = {
  description: "Show color of a hexadecimal value.",
  parameters: [
    {
      name: "hex",
      required: true
    }
  ],
  async execute (client, message, [ hex ]) {
    const canvas = global.canvas.createCanvas(64, 64);
    const ctx = canvas.getContext("2d");

    if (!/^([0-9A-F]{3}){1,2}$/i.test(hex)) return message.channel.send(`\`${hex}\` is not a valid hexadecimal color.`);

    if (!hex.startsWith("#")) hex = "#" + hex;

    // Set ctx properties
    ctx.fillStyle = hex;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const attachment = new global.Discord.MessageAttachment(canvas.toBuffer());

    return message.channel.send(attachment);
  }
};