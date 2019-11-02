module.exports = {
  name: 'avatar',
  descriptions: 'Displays a users avatar.',
  usage: '<member>',
  aliases: ['pfp', 'a'],
  async execute (client, message, args) {
    const member = message.mentions.users.first() || message.author;

    return message.channel.send(member.displayAvatarURL);
  }
};
