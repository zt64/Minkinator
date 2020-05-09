module.exports = {
  description: 'Flip a coin.',
  aliases: ['flip', 'coin'],
  async execute (client, message, args) {
    const guildConfig = await client.database.properties.findByPk('configuration').then(key => key.value);
    const embedColor = guildConfig.embedSuccessColor;

    const result = Math.random() > 0.5 ? 'Heads' : 'Tails';

    return message.channel.send(new client.Discord.MessageEmbed()
      .setColor(embedColor)
      .setTitle('Coin toss')
      .setDescription(result)
    );
  }
};