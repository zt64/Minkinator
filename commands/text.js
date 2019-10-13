module.exports = {
  name: 'text',
  description: 'Creates an image from text.',
  usage: '[font] [size] [text]',
  args: true,
  async execute (client, message, args) {
    const canvas = client.canvas.createCanvas(1024, 1024);
    const ctx = canvas.getContext('2d');

    const text = args.slice(2).join(' ');
    const font = args[0];
    const size = parseInt(args[1]);

    canvas.width = ctx.measureText(text).width * 3;
    canvas.height = size * 2;

    ctx.font = `${size}px ${font}`;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const attachment = new client.discord.Attachment(canvas.toBuffer());
    return message.channel.send(attachment);
  }
};
