module.exports = {
  description: 'Displays a members statistics.',
  aliases: ['bal', 'balance', 'statistics', 'user-info', 'level', 'lvl'],
  parameters: [
    {
      name: 'member',
      type: String
    }
  ],
  async execute (client, message, args) {
    const guildConfig = (await client.database.properties.findByPk('configuration')).value;
    const currency = guildConfig.currency;

    const user = message.mentions.users.first() || message.author;

    if (!user) return message.channel.send('Please specify a valid member.');

    const member = message.guild.member(user);
    const memberData = await client.database.members.findByPk(user.id);

    return message.channel.send(new client.discord.MessageEmbed()
      .setColor(client.config.embed.color)
      .setAuthor(`Statistics for ${member.nickname || user.tag}`, user.avatarURL())
      .addField('Balance:', `${currency}${memberData.balance.toFixed(2).toLocaleString()}`, true)
      .addField('Level:', memberData.level.toLocaleString(), true)
      .addField('Total experience:', `${memberData.xp.toLocaleString()} XP`, true)
      .addField('Total messages:', memberData.messages.toLocaleString(), true)
      .addField('Joined:', member.joinedAt.toLocaleDateString(), true)
      .addField('Created:', user.createdAt.toLocaleDateString(), true)
    );
  }
};