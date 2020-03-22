module.exports = {
  description: 'Roll a dice.',
  async execute (client, message, args) {
    const result = client.functions.randomInteger(1, 6);

    // Create embed

    const diceEmbed = new client.discord.MessageEmbed()
      .setColor(client.config.embed.color)
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