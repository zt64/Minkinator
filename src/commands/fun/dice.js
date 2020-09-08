module.exports = {
  description: "Roll a dice.",
  aliases: ["roll"],
  parameters: [
    {
      name: "sides",
      type: Number
    }
  ],
  async execute (client, message, args) {
    const guildConfig = global.guildInstance.guildConfig;
    const defaultColor = guildConfig.colors.default;
    const { randomInteger, sleep } = global.functions;

    const sides = !isNaN(args[0]) ? args[0] : 6;

    // Generate number
    const result = randomInteger(1, sides);

    // Create embed
    const diceEmbed = new global.Discord.MessageEmbed()
      .setColor(defaultColor)
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