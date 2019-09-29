module.exports = {
  name: 'mute',
  description: 'Mutes a member',
  usage: '[member] <reason> <time>',
  args: true,
  async execute (client, message, args) {
    const member = message.mentions.members.first();

    member.removeRole('625385600081592321');
  }
};
