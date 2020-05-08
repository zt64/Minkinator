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

    const properties = client.database.properties;

    const guildConfig = await properties.findByPk('configuration').then(key => key.value);
    const bans = await properties.findByPk('bans').then(key => key.value);
    const embedColor = guildConfig.embedSuccessColor;

    const member = message.mentions.users.first();
    const reason = args.slice(2).join(' ');
    const minutes = args[1];

    await member.ban({ reason: reason });

    bans.push({
      id: member.user.id,
      epoch: Date.now()
    });

    message.channel.send(new client.Discord.MessageEmbed()
      .setColor(embedColor)
      .setAuthor(`${member.user.tag} has been banned${minutes ? ` for ${client.pluralize('minute', minutes, true)}` : ''}.`, member.user.avatarURL())
      .setDescription(reason || 'No reason provided.')
    );

    if (!minutes) return;

    await client.functions.sleep(minutes * 60000);

    message.guild.unban(member.user);

    return message.channel.send(new client.Discord.MessageEmbed()
      .setColor(embedColor)
      .setAuthor(`${member.user.tag} has been unbanned`, member.user.avatarURL())
    );
  }
};