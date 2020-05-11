module.exports = {
  description: 'Displays information regarding Minkinator.',
  async execute (client, message, args) {
    const guildConfig = await client.database.properties.findByPk('configuration').then(key => key.value);
    const successColor = guildConfig.embedColors.success;
    const owner = await client.users.fetch(client.config.ownerID);

    return message.channel.send(new client.Discord.MessageEmbed()
      .setColor(successColor)
      .setThumbnail(client.user.displayAvatarURL())
      .setTitle('Minkinator Information')
      .setDescription('Minkinator is a one of the kind ~~nightmare~~ friend that will help you along your journeys. He is the digitalized form of the rat god, Minky. Allow Minkinator to ~~take control of your life~~ help you out whenever the time comes.')
      .addField('Commands:', client.commands.size, true)
      .addField('Events:', client.events.size, true)
      .addField('GitHub:', 'https://github.com/Litleck/Minkinator')
      .addField('Patreon:', 'https://www.patreon.com/minkinator')
      .setFooter(`Created by Litleck (${owner.tag})`, owner.displayAvatarURL())
    );
  }
};