module.exports = {
  name: 'mute',
  description: 'Mutes a member',
  usage: '[member] <reason> <time>',
  permissions: ['BAN_MEMBERS'],
  args: true,
  async execute (client, message, args) {
    if (!message.mentions.members.first()) return message.reply(`${message.mentions.members.first()} is not a valid member.`);
    const member = message.mentions.members.first();

    message.guild.unban(member.user);
    return message.channel.send(`${member.user.tag} has been unbanned.`);
  }
};
