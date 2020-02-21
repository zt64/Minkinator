module.exports = {
  description: 'Change guild settings.',
  permissions: ['ADMINISTRATOR'],
  async execute (client, message, args) {
    const variables = client.database.variables;

    const guildConfigDB = await variables.findByPk('configuration');
    const guildConfig = guildConfigDB.value;

    const key = args[0];
    const value = args[1];

    if (key) {
      if (key in guildConfig) {
        if (!value) return message.channel.send(`A value is required for \`${key}\`.`);

        guildConfig[key] = JSON.parse(value);

        guildConfigDB.update({ value: guildConfig });

        return message.channel.send(`Successfully set \`${key}\` to \`${value}\`.`);
      } else {
        return message.channel.send(`\`${key}\` does not exist in the guild configuration.`);
      }
    };

    const configEmbed = new client.discord.MessageEmbed()
      .setColor(client.config.embed.color)
      .setTitle('Guild Configuration');

    for (const [key, value] of Object.entries(guildConfig)) {
      configEmbed.addField(key, value);
    }

    return message.channel.send(configEmbed);
  }
};