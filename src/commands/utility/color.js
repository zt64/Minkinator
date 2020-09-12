module.exports = {
  description: "Show color of a hexadecimal value.",
  parameters: [
    {
      name: "hex",
      type: String,
      required: true
    }
  ],
  async execute (client, message, [ hex ]) {
    const canvas = global.canvas.createCanvas(512, 512);
    const ctx = canvas.getContext("2d");

    // Set ctx properties
    ctx.fillStyle = hex;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    return message.channel.send(new global.Discord.MessageEmbed()
      .setTitle("Color")
      .setColor(hex)
      .setImage(canvas.toDataURL())
    );
  }
};