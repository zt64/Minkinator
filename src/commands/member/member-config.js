module.exports = {
  description: "Change your settings.",
  aliases: [ "mc" ],
  async execute (client, message, [ key, value ]) {
    const memberInstance = global.memberInstance;
    const memberConfig = await memberInstance.getMemberConfig();

    const guildConfig = global.guildInstance.guildConfig;
    const defaultColor = guildConfig.colors.default;

    if (key) {
      if (key in memberConfig) {
        if (!value) return message.channel.send(`A value is required for \`${key}\`.`);

        memberConfig[key] = JSON.parse(value);

        await memberInstance.update({ memberConfig: memberConfig });

        return message.channel.send(`Successfully set \`${key}\` to \`${value}\`.`);
      } else {
        return message.channel.send(`\`${key}\` does not exist in the member configuration.`);
      }
    }

    // Create embed
    const embed = new global.Discord.MessageEmbed()
      .setColor(defaultColor)
      .setTitle("Member Configuration");

    embed.setDescription(`\`\`\`json\n${JSON.stringify(memberConfig, null, 2)}\`\`\``);

    return message.channel.send(embed);
  }
};