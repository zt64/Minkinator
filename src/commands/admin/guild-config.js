module.exports = {
  description: 'Change guild settings.',
  permissions: ['ADMINISTRATOR'],
  parameters: [
    {
      name: 'key',
      type: String
    },
    {
      name: 'value'
    }
  ],
  async execute (client, message, args) {
    const properties = client.database.properties;

    const guildConfigDB = await properties.findByPk('configuration');
    const guildConfig = guildConfigDB.value;
    const successColor = guildConfig.embedColors.success;

    const key = args[0];
    const value = args.slice(1).join(' ');

    const configEmbed = new client.Discord.MessageEmbed()
      .setColor(successColor)
      .setTitle('Guild Configuration');

    // Send all configuration properties

    if (!key) {
      for (const [key, value] of Object.entries(guildConfig)) {
        configEmbed.addField(`${key}:`, `\`\`\`json\n${JSON.stringify(value, null, 2)}\`\`\``, true);
      }

      return message.channel.send(configEmbed);
    }

    // Check if arguments are valid

    if (!(key in guildConfig)) return message.channel.send(`\`${key}\` is not a guild property.`);

    if (!value) return message.channel.send(`A value is required for \`${key}\`.`);

    // Set property to input

    configEmbed.addField('Old value:', `\`\`\`js\n${JSON.stringify(guildConfig[key], null, 2)}\`\`\``, true);

    try {
      guildConfig[key] = JSON.parse(value);
    } catch (error) {
      return message.channel.send(`Unable to parse \`${value}\` for \`${key}\`.`);
    }

    guildConfigDB.update({ value: guildConfig });

    configEmbed.setDescription(`Successfully set \`${key}\` to \`${value}\`.`);
    configEmbed.addField('New value:', `\`\`\`js\n${value}\`\`\``, true);

    return message.channel.send(configEmbed);
  }
};