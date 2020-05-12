module.exports = {
  description: 'Roll a dice.',
  aliases: ['roll'],
  async execute (client, message, args) {
    const result = client.functions.randomInteger(1, 6);

    const guildConfig = await client.database.properties.findByPk('configuration').then(key => key.value);
    const successColor = guildConfig.colors.success;

    // Create embed

    const diceEmbed = new client.Discord.MessageEmbed()
      .setColor(successColor)
      .setTitle('Dice roll')
      .setDescription('Rolling...');

    // Send message

    const diceMessage = await message.channel.send(diceEmbed);

    await client.functions.sleep(1000);

    diceEmbed.setDescription(result);
    diceMessage.edit(diceEmbed);
  }
};