module.exports = {
  name: 'unmute',
  category: 'Administrator',
  description: 'Revokes a members mute.',
  permissions: ['MANAGE_CHANNELS'],
  parameters: [
    {
      name: 'member',
      type: String,
      required: true
    },
    {
      name: 'reason',
      type: String
    }
  ],
  async execute (client, message, args) {
    if (!message.mentions.members.first()) return message.reply(`${message.mentions.members.first()} is not a valid member.`);
    const member = message.mentions.members.first();

    member.roles.remove('625385600081592321');

    return message.channel.send(new client.discord.MessageEmbed()
      .setColor(client.config.embedColor)
      .setAuthor(`${member.user.tag} has been unmuted`, member.user.avatarURL())
      .setFooter(member.id)
      .setTimestamp());
  }
};