/* eslint-disable no-eval */
module.exports = {
  description: "Evaluates Javascript code.",
  aliases: ["evaluate"],
  parameters: [
    {
      name: "input",
      required: true
    }
  ],
  async execute (client, message, args) {
    const guildConfig = global.guildInstance.guildConfig;
    const defaultColor = guildConfig.colors.default;

    const input = args.join(" ");
    const embed = new global.Discord.MessageEmbed()
      .setColor(defaultColor);

    // Attempt to run code
    try {
      const result = await eval(`(async() => {${input}})()`);

      embed.setTitle("Result");
      embed.setDescription(`\`\`\`js\n${result}\`\`\``);
    } catch (error) {
      embed.setTitle("Error");
      embed.setDescription(`\`\`\`js\n${error}\`\`\``);
    }

    return message.channel.send(embed);
  }
};