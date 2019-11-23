module.exports = {
  name: 'unban',
  description: 'Revokes a members ban.',
  usage: '[member] <reason> <time>',
  permissions: ['BAN_MEMBERS'],
  args: true,
  async execute (client, message, args) {
    if (!message.mentions.members.first()) return message.reply(`${message.mentions.members.first()} is not a valid member.`);
    const member = message.mentions.members.first();

    message.guild.unban(member.user);

    return message.channel.send(new client.discord.MessageEmbed()
      .setColor(client.config.embedColor)
      .setAuthor(`${member.user.tag} has been unbanned`, member.user.avatarURL)
      .setFooter(member.id)
      .setTimestamp());
  }
};
