module.exports = {
  description: "Change your settings.",
  async execute (client, message, args) {
    const memberData = await client.database.members.findByPk(message.author.id);
    const memberConfig = memberData.configuration;

    const guildConfig = await client.database.properties.findByPk("configuration").then(key => key.value);
    const defaultColor = guildConfig.colors.default;

    const key = args[0];
    const value = args[1];

    if (key) {
      if (key in memberConfig) {
        if (!value) return message.channel.send(`A value is required for \`${key}\`.`);

        memberConfig[key] = JSON.parse(value);

        await memberData.update({ configuration: memberConfig });

        return message.channel.send(`Successfully set \`${key}\` to \`${value}\`.`);
      } else {
        return message.channel.send(`\`${key}\` does not exist in the member configuration.`);
      }
    }

    // Create embed
    const configEmbed = new global.Discord.MessageEmbed()
      .setColor(defaultColor)
      .setTitle("Member Configuration");

    for (const [key, value] of Object.entries(memberConfig)) {
      configEmbed.addField(key, value);
    }

    return message.channel.send(configEmbed);
  }
};