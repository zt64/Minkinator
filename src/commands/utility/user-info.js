module.exports = {
  description: 'Shows the users information.',
  async execute (client, message, args) {
    const user = message.mentions.users.first() || message.author;
    const guildConfig = await client.database.properties.findByPk('configuration').then(key => key.value);
    const embedColor = guildConfig.embedSuccessColor;

    const platforms = [];

    if (user.presence.clientStatus.web) platforms.push('Web');
    if (user.presence.clientStatus.mobile) platforms.push('Mobile');
    if (user.presence.clientStatus.desktop) platforms.push('Desktop');

    const infoEmbed = new client.Discord.MessageEmbed()
      .setColor(embedColor)
      .setAuthor(`User information: ${user.tag}`, user.avatarURL())
      .addField('ID:', user.id)
      .addField('Created:', user.createdAt.toLocaleDateString(), true)
      .addField('Status:', user.presence.status === 'dnd' ? 'DND' : client.functions.capitalize(user.presence.status), true);

    if (platforms.length !== 0) {
      infoEmbed.addField('Platforms:', platforms.join(', '), true);
    }

    return message.channel.send(infoEmbed);
  }
};