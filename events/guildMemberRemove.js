module.exports = async (client, member) => {
  console.log(`${member.user.tag} has left the server.`);

  const embed = new client.discord.RichEmbed()
    .setAuthor(`${member.user.tag} (${member.id})`, member.user.displayAvatarURL)
    .setFooter('User left')
    .setColor('#1ED760')
    .setTimestamp();

  client.channels.get('625415676932259840').send(embed);

  (await client.models.members.findByPk(member.id)).destroy();
};
