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
  async execute (_, message, [ key, value ]) {
    const guildConfig = await global.sequelize.models.guildConfig.findByPk(message.guild.id);

    const embed = new Discord.MessageEmbed({
      color: global.config.colors.default,
      title: "Guild Configuration"
    });

    if (key) {
      if (!guildConfig[key]) return message.reply(`\`${key}\` does not exist in the guild configuration.`);
      if (key === "guildId") return message.reply("Unable to modify `guildId` as it is the foreign key.");
      if (typeof(guildConfig[key]) === "object");

      await guildConfig.update({ [key]: value });

      embed.setDescription(`Successfully set \`${key}\` to \`${value}\`.`);
    } else {
      embed.setDescription(`\`\`\`json\n${JSON.stringify(guildConfig.dataValues, null, 2)}\`\`\``);
    }

    return message.reply(embed);
  }
};