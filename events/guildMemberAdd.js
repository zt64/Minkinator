module.exports = async (client, member) => {
  const channel = member.guild.channels.find(channel => channel.name.includes('member-log'));

  channel.send(new client.discord.MessageEmbed()
    .setAuthor(`${member.user.tag} (${member.id})`, member.user.avatarURL())
    .setFooter('User joined')
    .setColor('#1ED760')
    .setTimestamp());

  console.log(`${member.user.tag} has joined the server.`);

  await client.models.members.create({ name: member.user.tag, id: member.id });
};
