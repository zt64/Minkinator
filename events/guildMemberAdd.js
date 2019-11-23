module.exports = async (client, member) => {
  const channel = member.guild.channels.find(channel => channel.name.includes('member-log'));

  channel.send(new client.discord.MessageEmbed()
    .setAuthor(`${member.user.tag} (${member.id})`, member.user.avatarURL())
    .setFooter('User joined')
    .setColor(client.config.embedColor)
    .setTimestamp());

  console.log(`${member.user.tag} has joined the server.`);

  await client.models[member.guild.name].members.create({ name: member.user.tag, id: member.id });
};
