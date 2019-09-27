module.exports = {
  name: 'kick',
  description: 'Kicks a member.',
  usage: '[member] <reason>',
  permissions: ['KICK_MEMBERS'],
  args: true,
  execute (client, message, args) {
    const member = message.guild.member(message.mentions.users.first());
    return member.kick();
  }
};
