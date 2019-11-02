module.exports = {
  name: 'stats',
  description: 'Displays a members statistics.',
  aliases: ['bal', 'balance', 'statistics'],
  usage: '<member>',
  async execute (client, message, args) {
    const member = message.mentions.users.first() || message.author;
    const memberData = await client.models.members.findByPk(member.id);

    const embed = new client.discord.RichEmbed()
      .setColor('#1ED760')
      .setTitle(`Statistics for ${memberData.name}`, true)
      .setThumbnail(member.displayAvatarURL)
      .addField('Balance:', `${client.config.currency}${memberData.balance}`, true)
      .addField('Level:', memberData.level, true)
      .addField('Total experience:', `${memberData.xp} XP`, true)
      .addField('Total messages:', memberData.messages, true)
      .addField('Joined:', message.guild.member(member).joinedAt.toLocaleDateString(), true)
      .addField('Created:', member.createdAt.toLocaleDateString(), true)
      .setFooter(`${memberData.id}`)
      .setTimestamp();

    return message.channel.send(embed);
  }
};
