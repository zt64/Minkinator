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
    const { randomInteger, sleep } = global.functions;

    if (isNaN(sides)) sides = 6;

    // Generate number
    const result = randomInteger(1, sides);

    // Create embed
    const diceEmbed = new global.Discord.MessageEmbed()
      .setColor(colors.default)
      .setTitle("Dice roll")
      .setDescription("Rolling...");

    // Send message
    const diceMessage = await message.channel.send(diceEmbed);

    await sleep(1000);

    // Edit embed
    diceEmbed.setDescription(result);
    diceMessage.edit(diceEmbed);
  }
};