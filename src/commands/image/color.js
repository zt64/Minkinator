const { createCanvas } = require("canvas");

module.exports = {
  description: "Show color of a hexadecimal value.",
  parameters: [
    {
      name: "hex",
      required: true
    }
  ],
  async execute (client, message, [ hex ]) {
    const canvas = createCanvas(64, 64);
    const ctx = canvas.getContext("2d");

    if (!/^([0-9A-F]{3}){1,2}$/i.test(hex)) return message.reply(`\`${hex}\` is not a valid hexadecimal color.`);

    if (!hex.startsWith("#")) hex = "#" + hex;

    // Set ctx properties
    ctx.fillStyle = hex;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    return message.reply(new Discord.MessageAttachment(canvas.toBuffer()));
  }
};