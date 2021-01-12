module.exports = {
  description: "Roll a dice.",
  aliases: ["roll"],
  parameters: [
    {
      name: "sides",
      type: Number
    }
  ],
  async execute (client, message, [ sides ]) {
    const { colors } = global.guildInstance.config;

    if (isNaN(sides)) sides = 6;

    // Generate number
    const result = util.randomInteger(1, sides);

    // Create embed
    const diceEmbed = new Discord.MessageEmbed({
      color: colors.default,
      title: "Dice Roll",
      description: "Rolling..."
    });

    // Send message
    const diceMessage = await message.channel.send(diceEmbed);

    await util.sleep(1000);

    // Edit embed
    diceEmbed.setDescription(result);
    diceMessage.edit(diceEmbed);
  }
};