module.exports = {
  description: 'Roll a dice.',
  async execute (client, message, args) {
    const result = client.functions.randomInteger(1, 6);

    const guildConfig = await client.database.properties.findByPk('configuration').then(key => key.value);
    const embedColor = guildConfig.embedSuccessColor;

    // Create embed

    const diceEmbed = new client.Discord.MessageEmbed()
      .setColor(embedColor)
      .setTitle('Dice roll')
      .setDescription('Rolling...')
      .setTimestamp();

    // Send message

    const diceMessage = await message.channel.send(diceEmbed);

    // Delete message

    setTimeout(() => {
      diceEmbed.setDescription(result);
      diceMessage.edit(diceEmbed);
    }, 1000);
  }
};