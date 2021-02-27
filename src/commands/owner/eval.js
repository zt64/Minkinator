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
    const { colors } = await global.sequelize.models.guildConfig.findByPk(message.guild.id);

    const input = args.join(" ");
    const embed = new Discord.MessageEmbed({ color: colors.default });

    // Attempt to run code
    try {
      const jsFunction = Function(`"use strict"; return (async () => { ${input} })()`);
      const result = await jsFunction();

      embed.setTitle("Result");
      embed.setDescription(`\`\`\`js\n${result}\`\`\``);
    } catch (error) {
      embed.setTitle("Error");
      embed.setDescription(`\`\`\`js\n${error.stack}\`\`\``);
    }

    return message.reply(embed);
  }
};