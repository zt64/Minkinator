module.exports = {
  name: 'kick',
  description: 'Kicks a member.',
  usage: '[member] <reason>',
  permissions: ['KICK_MEMBERS'],
  args: true,
  execute (client, message, args) {
    const member = message.mentions.members.first();

    if (!member) return message.reply(`${message.mentions.members.first()} is not a valid member.`);

    return message.guild.member(member).kick();
  }
};
