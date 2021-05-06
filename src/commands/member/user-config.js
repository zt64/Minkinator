module.exports = {
  description: "Change your settings.",
  aliases: [ "mc" ],
  async execute (_, message, [ key, value ]) {
    const [ userConfig ] = await global.sequelize.models.userConfig.findOrCreate({ where: { userId: message.author.id } });

    delete userConfig.dataValues.userId;

    const embed = new Discord.MessageEmbed({
      color: global.config.colors.default,
      title: "User Configuration"
    });

    if (key) {
      if (key in userConfig) {
        if (!value) return message.reply(`A value is required for \`${key}\`.`);

        userConfig[key] = JSON.parse(value);

        await userConfig.update({ [key]: value });

        return message.reply(`Successfully set \`${key}\` to \`${value}\`.`);
      } else {
        return message.reply(`\`${key}\` does not exist in the user configuration.`);
      }
    }

    embed.setDescription(`\`\`\`json\n${JSON.stringify(userConfig, null, 2)}\`\`\``);

    return message.reply(embed);
  }
};