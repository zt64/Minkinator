module.exports = {
  description: 'Change guild settings.',
  permissions: ['ADMINISTRATOR'],
  async execute (client, message, args) {
    const properties = client.database.properties;

    const guildConfigDB = await properties.findByPk('configuration');
    const guildConfig = guildConfigDB.value;
    const embedColor = guildConfig.embedSuccessColor;

    const key = args[0];
    const value = args[1];

    if (key) {
      if (key in guildConfig) {
        if (!value) return message.channel.send(`A value is required for \`${key}\`.`);

        try {
          guildConfig[key] = JSON.parse(value);
        } catch (error) {
          guildConfig[key] = value;
        }

        guildConfigDB.update({ value: guildConfig });

        return message.channel.send(new client.Discord.MessageEmbed()
          .setColor(embedColor)
          .setTitle('Guild Configuration')
          .setDescription(`Successfully set \`${key}\` to \`${value}\`.`));
      } else {
        return message.channel.send(`\`${key}\` does not exist in the guild configuration.`);
      }
    };

    const configEmbed = new client.Discord.MessageEmbed()
      .setColor(embedColor)
      .setTitle('Guild Configuration');

    for (const [key, value] of Object.entries(guildConfig)) {
      configEmbed.addField(key, value, true);
    }

    return message.channel.send(configEmbed);
  }
};