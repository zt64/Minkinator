module.exports = {
  description: 'Shows the exact time.',
  async execute (client, message, args) {
    const moment = client.moment;
    const guildConfig = await client.database.properties.findByPk('configuration').then(key => key.value);
    const successColor = guildConfig.embedColors.success;

    const timeEmbed = new client.Discord.MessageEmbed()
      .setColor(successColor)
      .setTitle('Time / Date')
      .addField('UTC Date:', moment.utc().format('dddd MMMM DD, YYYY'))
      .addField('UTC Time:', moment.utc().format('kk:mm:ss'))
      .addField('Unix Timestamp:', moment().unix());

    return message.channel.send(timeEmbed);
  }
};