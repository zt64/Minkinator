module.exports = {
  description: 'Bans a member.',
  permissions: ['BAN_MEMBERS'],
  parameters: [
    {
      name: 'member',
      type: String,
      required: true
    },
    {
      name: 'minutes',
      type: Number
    },
    {
      name: 'reason',
      type: String
    }
  ],
  async execute (client, message, args) {
    if (!message.mentions.members.first()) return message.reply(`${message.mentions.members.first()} is not a valid member.`);
    const guildConfig = await client.database.properties.findByPk('configuration').then(key => key.value);
    const embedColor = guildConfig.embedSuccessColor;

    const member = message.mentions.members.first();
    const reason = args.slice(2).join(' ');
    const minutes = args[1];

    member.ban({ reason: reason });

    message.channel.send(new client.Discord.MessageEmbed()
      .setColor(embedColor)
      .setAuthor(`${member.user.tag} has been banned${minutes ? ` for ${client.pluralize('minute', minutes, true)}` : ''}.`, member.user.avatarURL())
      .setDescription(reason || 'No reason provided.')
      .setFooter(member.id)
    );

    if (minutes) {
      setTimeout(() => {
        message.guild.unban(member.user);

        return message.channel.send(new client.Discord.MessageEmbed()
          .setColor(embedColor)
          .setAuthor(`${member.user.tag} has been unbanned`, member.user.avatarURL())
          .setFooter(member.id)
        );
      }, minutes * 60000);
    }
  }
};