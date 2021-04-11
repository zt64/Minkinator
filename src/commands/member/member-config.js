module.exports = {
  description: "Change your settings.",
  aliases: [ "mc" ],
  async execute (client, message, [ key, value ]) {
    const [ memberConfig ] = await global.sequelize.models.memberConfig.findOrCreate({ where: { userId: message.author.id } });

    delete memberConfig.dataValues.userId;

    const embed = new Discord.MessageEmbed({
      color: global.config.colors.default,
      title: "Member Configuration"
    });

    if (key) {
      if (key in memberConfig) {
        if (!value) return message.reply(`A value is required for \`${key}\`.`);

        memberConfig[key] = JSON.parse(value);

        await memberConfig.update({ [key]: value });

        return message.reply(`Successfully set \`${key}\` to \`${value}\`.`);
      } else {
        return message.reply(`\`${key}\` does not exist in the member configuration.`);
      }
    }

    embed.setDescription(`\`\`\`json\n${JSON.stringify(memberConfig, null, 2)}\`\`\``);

    return message.reply(embed);
  }
};