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
    if (isNaN(sides)) sides = 6;

    // Generate number
    const side = util.randomInteger(1, sides);

    // Create embed
    const diceEmbed = new Discord.MessageEmbed({
      color: global.config.colors.default,
      title: "Dice Roll",
      description: "Rolling..."
    });

    // Send message
    const diceMessage = await message.reply(diceEmbed);

    await util.sleep(1000);

    // Edit embed
    diceEmbed.setDescription(`You rolled a ${side}`);
    diceMessage.edit(diceEmbed);
  }
};