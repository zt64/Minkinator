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
      .setTitle(`Statistics for ${memberData.name}`)
      .setThumbnail(member.displayAvatarURL)
      .addField('Balance:', `${client.config.currency}${memberData.balance}`)
      .addField('Level:', `${memberData.level}`)
      .addField('Total experience:', `${memberData.xp} XP`)
      .addField('Total messages:', `${memberData.messages}`)
      .addField('Joined:', `${message.guild.member(member).joinedAt.toLocaleDateString()}`)
      .addField('Created:', `${member.createdAt.toLocaleDateString()}`)
      .setFooter(`${memberData.id}`)
      .setTimestamp();

    return message.channel.send(embed);
  }
};
