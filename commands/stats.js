module.exports = {
  name: 'stats',
  description: 'Displays a users statistics.',
  aliases: ['bal', 'balance', 'statistics'],
  usage: '<user>',
  async execute (client, message, args) {
    const user = message.mentions.users.first() || message.author;
    const userData = await client.models.users.findByPk(user.id);

    const embed = new client.discord.RichEmbed()
      .setColor('#1ED760')
      .setTitle(`Statistics for ${userData.name}`)
      .setThumbnail(user.displayAvatarURL)
      .addField('Balance:', `${client.config.currency}${userData.balance}`)
      .addField('Level:', `${userData.level}`)
      .addField('Total experience:', `${userData.xp} XP`)
      .addField('Total messages:', `${userData.messages}`)
      .addField('Joined:', `${message.guild.member(user).joinedAt.toLocaleDateString()}`)
      .addField('Created:', `${user.createdAt.toLocaleDateString()}`)
      .setFooter(`${userData.id}`)
      .setTimestamp();

    return message.channel.send(embed);
  }
};
