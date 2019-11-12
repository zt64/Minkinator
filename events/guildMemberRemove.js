module.exports = async (client, member) => {
  const channel = member.guild.channels.find(channel => channel.name.includes('member-log'));

  channel.send(new client.discord.MessageEmbed()
    .setAuthor(`${member.user.tag} (${member.id})`, member.user.avatarURL())
    .setFooter('User left')
    .setColor('#1ED760')
    .setTimestamp());

  console.log(`${member.user.tag} has left the server.`);

  (await client.models.members.findByPk(member.id)).destroy();
};
