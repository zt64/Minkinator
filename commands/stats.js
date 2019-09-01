module.exports = {
  name: 'stats',
  description: 'Displays a users statistics.',
  aliases: ['bal', 'balance', 'statistics'],
  usage: '<user>',
  async execute (client, message, args) {
    if (args[0]) {
      var user = await client.models.users.findByPk(message.mentions.members.first().id)
      var member = message.mentions.users.first()
    } else {
      user = await client.models.users.findByPk(message.author.id)
      member = message.author
    }

    const embed = new client.discord.RichEmbed()
      .setColor('#34eb3d')
      .setTitle(`Statistics for @${user.name}`)
      .setThumbnail(member.displayAvatarURL)
      .addField('Balance', `${client.config.currency}${user.balance}`)
      .addField('Level', `${user.level}`)
      .addField('Total experience', `${user.xp} XP`)
      .addField('Total messages', `${user.messages}`)
      .setTimestamp()
      .setFooter(`${user.name}`)

    message.channel.send(embed)
  }
}
