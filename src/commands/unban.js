module.exports = {
  name: 'unban',
  category: 'Administrator',
  description: 'Revokes a members ban.',
  permissions: ['BAN_MEMBERS'],
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

    message.guild.unban(member.user);

    return message.channel.send(new client.discord.MessageEmbed()
      .setColor(client.config.embedColor)
      .setAuthor(`${member.user.tag} has been unbanned`, member.user.avatarURL)
      .setFooter(member.id)
      .setTimestamp());
  }
};