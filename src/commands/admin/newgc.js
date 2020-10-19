module.exports = {
  description: "Change guild settings.",
  permissions: ["ADMINISTRATOR"],
  aliases: ["gc"],
  parameters: [
    {
      name: "key",
      type: String
    },
    {
      name: "value"
    }
  ],
  async execute (client, message, [ key, value ]) {
    const guildConfig = global.guildInstance.config;
    const defaultColor = guildConfig.dataValues.colors.default;

    const embed = new global.Discord.MessageEmbed()
      .setColor(defaultColor)
      .setTitle("Guild Configuration");

    if (key) {
      if (!guildConfig[key]) return message.channel.send(`\`${key}\` does not exist in the guild configuration.`);

      if (typeof(guildConfig[key]) === "object");

      await guildConfig.update({ [key]: value });

      embed.setDescription(`Successfully set \`${key}\` to \`${value}\`.`);
    } else {
      embed.setDescription(`\`\`\`json\n${JSON.stringify(guildConfig.dataValues, null, 2)}\`\`\``);
    }

    return message.channel.send(embed);
  }
};