module.exports = {
  name: 'stats',
  description: 'Displays a members statistics.',
  aliases: ['bal', 'balance', 'statistics', 'userinfo', 'level', 'lvl'],
  usage: '<member>',
  async execute (client, message, args) {
    const user = message.mentions.users.first() || message.author;
    const member = message.guild.member(user);
    const memberData = await client.models[message.guild.name].members.findByPk(user.id);

    const embed = new client.discord.MessageEmbed()
      .setColor(client.config.embedColor)
      .setAuthor(`Statistics for ${member.nickname}`, user.avatarURL())
      .addField('Balance:', `${client.config.currency}${memberData.balance.toLocaleString()}`, true)
      .addField('Level:', memberData.level.toLocaleString(), true)
      .addField('Total experience:', `${memberData.xp.toLocaleString()} XP`, true)
      .addField('Total messages:', memberData.messages.toLocaleString(), true)
      .addField('Joined:', member.joinedAt.toLocaleDateString(), true)
      .addField('Created:', user.createdAt.toLocaleDateString(), true)
      .addField('Status:', member.presence.status)
      .addField('Presence:', member.presence.activity.details)
      .setFooter(`${memberData.id}`)
      .setTimestamp();

    return message.channel.send(embed);
  }
};
