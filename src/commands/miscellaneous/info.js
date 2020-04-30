module.exports = {
  description: 'Displays information regarding Minkinator.',
  async execute (client, message, args) {
    const guildConfig = await client.database.properties.findByPk('configuration').then(key => key.value);
    const embedColor = guildConfig.embedSuccessColor;

    return message.channel.send(new client.Discord.MessageEmbed()
      .setColor(embedColor)
      .setTitle('Minkinator Information')
      .setDescription('Minkinator is a one of the kind ~~nightmare~~ friend that will help you along your journeys. He is the digitalized form of the rat god, Minky. Allow Minkinator to ~~take control of your life~~ help you out whenever the time comes.')
      .addField('Commands:', client.commands.size, true)
      .addField('Events:', client.events.size, true)
      .addField('Uptime (HH:mm:ss):', client.moment.utc(client.uptime).format('HH:mm:ss'), true)
      .addField('GitHub:', 'https://github.com/Litleck/Minkinator')
      .addField('Patreon:', 'Patreon')
      .setFooter(`Created by Litleck (${await client.users.fetch(client.config.ownerID).then(user => user.tag)})`)
    );
  }
};