module.exports = {
  name: 'unban',
  description: 'Mutes a member',
  usage: '[member] <reason> <time>',
  permissions: ['BAN_MEMBERS'],
  args: true,
  async execute (client, message, args) {
    if (!message.mentions.members.first()) return message.reply(`${message.mentions.members.first()} is not a valid member.`);
    const member = message.mentions.members.first();

    message.guild.unban(member.user);

    return message.channel.send(new client.discord.RichEmbed()
      .setColor('#1ED760')
      .setAuthor(`${member.user.tag} has been unbanned`, member.user.displayAvatarURL)
      .setFooter(member.id)
      .setTimestamp());
  }
};
