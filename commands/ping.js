module.exports = {
  name: 'ping',
  description: 'Sends a ping',
  async execute (client, message, args) {
    return message.channel.send(new client.discord.MessageEmbed()
      .setColor('#1ED760')
      .setTitle('Ping')
      .setTimestamp());
  }
};
