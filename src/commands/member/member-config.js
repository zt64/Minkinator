module.exports = {
  description: "Change your settings.",
  aliases: [ "mc" ],
  async execute (client, message, [ key, value ]) {
    const memberConfig = global.memberInstance.config;

    const guildConfig = global.guildInstance.config;
    const defaultColor = guildConfig.colors.default;

    const embed = new global.Discord.MessageEmbed()
      .setColor(defaultColor)
      .setTitle("Member Configuration");

    if (key) {
      if (key in memberConfig) {
        if (!value) return message.channel.send(`A value is required for \`${key}\`.`);

        memberConfig[key] = JSON.parse(value);

        await memberConfig.update({ [key]: value });

        return message.channel.send(`Successfully set \`${key}\` to \`${value}\`.`);
      } else {
        return message.channel.send(`\`${key}\` does not exist in the member configuration.`);
      }
    }

    // Create embed
    

    embed.setDescription(`\`\`\`json\n${JSON.stringify(memberConfig, null, 2)}\`\`\``);

    return message.channel.send(embed);
  }
};