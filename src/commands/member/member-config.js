module.exports = {
  description: 'Change your settings.',
  async execute (client, message, args) {
    const memberData = await client.database.members.findByPk(message.author.id);
    const memberConfig = memberData.configuration;

    const key = args[0];
    const value = args[1];

    if (key) {
      if (key in memberConfig) {
        if (!value) return message.channel.send(`A value is required for \`${key}\`.`);

        memberConfig[key] = JSON.parse(value);

        memberData.update({ configuration: memberConfig });

        return message.channel.send(`Successfully set \`${key}\` to \`${value}\`.`);
      } else {
        return message.channel.send(`\`${key}\` does not exist in the member configuration.`);
      }
    };

    const configEmbed = new client.discord.MessageEmbed()
      .setColor(client.config.embed.color)
      .setTitle('Member Configuration');

    for (const [key, value] of Object.entries(memberConfig)) {
      configEmbed.addField(key, value);
    }

    return message.channel.send(configEmbed);
  }
};