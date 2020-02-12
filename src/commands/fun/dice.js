module.exports = {
  name: 'dice',
  description: 'Roll a dice.',
  async execute (client, message, args) {
    const result = client.functions.randomInteger(1, 6);

    const diceEmbed = new client.discord.MessageEmbed()
      .setColor(client.config.embed.color)
      .setTitle('Dice roll')
      .setDescription('Rolling...')
      .setTimestamp();

    const diceMessage = await message.channel.send(diceEmbed);

    setTimeout(() => {
      diceEmbed.setDescription(result);
      diceMessage.edit(diceEmbed);
    }, 1000);
  }
};