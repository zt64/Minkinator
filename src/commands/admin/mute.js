module.exports = {
  description: 'Mutes a member.',
  permissions: ['MANAGE_CHANNELS'],
  parameters: [
    {
      name: 'member',
      type: String,
      required: true
    },
    {
      name: 'time',
      type: Number
    },
    {
      name: 'reason',
      type: String
    }
  ],
  async execute (client, message, args) {
    if (!message.mentions.members.first()) return message.reply(`${message.mentions.members.first()} is not a valid member.`);

    const member = message.mentions.members.first();

    await member.roles.add('671902495726895127');

    message.channel.send(new client.discord.MessageEmbed()
      .setColor(client.config.embed.color)
      .setAuthor(`${member.user.tag} has been muted${args[1] ? ` for ${args[1]} minute(s)` : ''}.`, member.user.avatarURL())
      .setDescription(args[2] ? args.slice(2).join(' ') : 'No reason provided.')
      .setFooter(member.id)
      .setTimestamp());

    if (args[1]) {
      setTimeout(() => {
        member.removeRole('625385600081592321');
        return message.channel.send(new client.discord.MessageEmbed()
          .setColor(client.config.embed.color)
          .setAuthor(`${member.user.tag} has been unmuted`, member.user.avatarURL)
          .setFooter(member.id)
          .setTimestamp());
      }, client.functions.convertTime());
    }
  }
};