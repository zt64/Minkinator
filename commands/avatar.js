module.exports = {
  name: 'avatar',
  descriptions: 'Displays a users avatar.',
  usage: '<member>',
  aliases: ['pfp', 'a'],
  async execute (client, message, args) {
    const user = message.mentions.users.first() || message.author;

    return message.channel.send(new client.discord.MessageEmbed()
      .setColor(client.config.embedColor)
      .setTitle(`Avatar of ${user.tag}`)
      .setURL(user.avatarURL())
      .setImage(user.avatarURL())
      .setFooter(user.id)
    );
  }
};
