module.exports = {
  name: 'bot-info',
  description: 'Returns bot information and ',
  async execute (client, message, args) {
    return message.channel.send(new client.discord.MessageEmbed()
      .setColor(client.config.embedColor)
      .setTitle('Minkinator Information')
      .setDescription('Minkinator is a one of the kind ~~nightmare~~ friend that will help you along your journeys. He is the digitalized form of the rat god, Minky. Allow Minkinator to ~~take control of your life~~ help you out whenever the time comes.')
      .addField('Commands:', client.commands.size, true)
      .addField('Events:', client.events.size, true)
      .addField('Uptime (HH:mm:ss):', client.moment.utc(client.uptime).format('HH:mm:ss'), true)
      .setFooter(`Created by Litleck (${(await client.users.fetch(client.config.botOwner)).tag})`)
    );
  }
};