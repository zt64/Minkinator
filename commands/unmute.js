module.exports = {
  name: 'unmute',
  description: 'Mutes a member',
  usage: '[member] <reason> <time>',
  permissions: ['MANAGE_CHANNELS'],
  args: true,
  async execute (client, message, args) {
    if (!message.mentions.members.first()) return message.reply(`${message.mentions.members.first()} is not a valid member.`);
    const member = message.mentions.members.first();

    member.roles.remove('625385600081592321');

    return message.channel.send(new client.discord.MessageEmbed()
      .setColor('#1ED760')
      .setAuthor(`${member.user.tag} has been unmuted`, member.user.avatarURL())
      .setFooter(member.id)
      .setTimestamp());
  }
};
