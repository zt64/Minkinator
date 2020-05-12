module.exports = {
  description: 'Displays a members statistics.',
  aliases: ['bal', 'balance', 'stats', 'xp', 'level', 'lvl'],
  parameters: [
    {
      name: 'member',
      type: String
    }
  ],
  async execute (client, message, args) {
    const guildConfig = await client.database.properties.findByPk('configuration').then(key => key.value);
    const successColor = guildConfig.colors.success;
    const currency = guildConfig.currency;

    const user = message.mentions.users.first() || message.author;

    if (!user) return message.channel.send('Please specify a valid member.');

    const member = message.guild.member(user);
    const [memberData] = await client.database.members.findOrCreate({ where: { id: user.id }, defaults: { name: user.tag } });

    const infoEmbed = new client.Discord.MessageEmbed()
      .setColor(successColor)
      .setAuthor(`Member information: ${member.nickname || user.tag}`, user.avatarURL())
      .addField('Balance:', `${currency}${memberData.balance.toFixed(2).toLocaleString()}`, true)
      .addField('Level:', memberData.level.toLocaleString(), true)
      .addField('Total messages:', memberData.messages.toLocaleString(), true)
      .addField('Total experience:', `${memberData.xpTotal.toLocaleString()} XP`, true)
      .addField('Required experience', `${memberData.xpRequired.toLocaleString()} XP`, true)
      .addField('Joined:', member.joinedAt.toLocaleDateString(), true);

    return message.channel.send(infoEmbed);
  }
};