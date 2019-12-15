module.exports = {
  name: 'color',
  description: '',
  usage: '[hex]',
  args: true,
  async execute (client, message, args) {
    const canvas = client.canvas.createCanvas(512, 512);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = args[0];
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    return message.channel.send(new client.discord.MessageEmbed()
      .setTitle('Color')
      .setColor('#0099ff')
      .setImage(canvas.toBlob())
    );
  }
};
