module.exports = {
  description: 'Shows the users information.',
  async execute (client, message, args) {
    const user = message.mentions.users.first() || message.author;

    const infoEmbed = new client.discord.MessageEmbed()
      .setColor(client.config.embed.color)
      .setTitle('User information')
      .addField('ID:', user.id)

    return message.channel.send(infoEmbed);
  }
}