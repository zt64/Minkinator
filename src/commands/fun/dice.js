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
    const guildConfig = await client.database.properties.findByPk("configuration").then(key => key.value);
    const successColor = guildConfig.colors.success;
    const { randomInteger, sleep } = client.functions;

    const sides = !isNaN(args[0]) ? args[0] : 6;

    // Generate number
    const result = randomInteger(1, sides);

    // Create embed
    const diceEmbed = new client.Discord.MessageEmbed()
      .setColor(successColor)
      .setTitle("Dice roll")
      .setDescription("Rolling...");

    // Send message
    const diceMessage = await message.channel.send(diceEmbed);

    await sleep(1000);

    diceEmbed.setDescription(result);
    diceMessage.edit(diceEmbed);
  }
};