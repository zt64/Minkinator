module.exports = {
  name: 'toss',
  description: 'Flip a coin.',
  aliases: ['flip', 'coin'],
  async execute (client, message, args) {
    const result = Math.random();

    return message.channel.send(new client.discord.MessageEmbed()
      .setColor(client.config.embed.color)
      .setTitle('Coin toss')
      .setDescription(result > 0.5 ? 'Heads' : 'Tails')
    );
  }
};