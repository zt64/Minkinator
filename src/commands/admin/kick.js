module.exports = {
  description: 'Kicks a member.',
  permissions: ['KICK_MEMBERS'],
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
    const guildConfig = await client.database.properties.findByPk('configuration').then(key => key.value);
    const embedColor = guildConfig.embedSuccessColor;

    const member = message.mentions.members.first();
    const reason = args.slice(1).join(' ');

    if (!member) return message.reply(`${message.mentions.members.first()} is not a valid member.`);

    message.guild.member(member).kick();

    return message.channel.send(new client.Discord.MessageEmbed()
      .setColor(embedColor)
      .setTitle(`${member.user.tag} has been kicked`)
      .setDescription(reason || 'No reason provided.')
    );
  }
};