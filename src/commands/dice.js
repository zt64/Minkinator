module.exports = {
  name: 'dice',
  description: 'Roll a dice.',
  async execute (client, message, args) {
    const result = client.functions.randomInteger(1, 6);

    return message.channel.send(new client.discord.MessageEmbed()
      .setColor(client.config.embedColor)
      .setTitle('Dice roll')
      .setDescription(result)
    );
  }
};