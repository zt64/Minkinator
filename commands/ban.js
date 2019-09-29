module.exports = {
  name: 'ban',
  description: 'Bans a member.',
  usage: '[member] <reason>',
  args: true,
  async execute (client, message, args) {
    const member = message.mentions.members.first();
  }
};
