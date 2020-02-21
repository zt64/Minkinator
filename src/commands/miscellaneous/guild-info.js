module.exports = {
  description: 'Shows guild information.',
  aliases: ['gi', 'guildinfo'],
  async execute (client, message, args) {
    const guild = message.guild;

    const createdAt = client.moment(guild.createdAt).format('MM/DD/YYYY');

    const infoEmbed = new client.discord.MessageEmbed()
      .setColor(client.config.embed.color)
      .setTitle('Guild Information')
      .setThumbnail(guild.iconURL())
      .addField('Name:', guild.name, true)
      .addField('ID:', guild.id, true)
      .addField('Owner:', guild.owner, true)
      .addField('Roles:', guild.roles.cache.size, true)
      .addField('Features:', guild.features.length >= 1 ? guild.features : 'None', true)
      .addField('Channels:', guild.channels.cache.size, true)
      .addField('Created:', createdAt, true)
      .addField('Emojis:', guild.emojis.cache.size, true)
      .addField('Members:', guild.members.cache.size, true)
      .addField('Maximum Members:', guild.maximumMembers || 'None', true)
      .addField('Region:', guild.region, true);

    if (guild.description) infoEmbed.setDescription(guild.description);

    return message.channel.send(infoEmbed);
  }
};