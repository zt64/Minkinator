module.exports = async (client, member) => {
  const channel = member.guild.channels.find(channel => channel.name.includes('member-log'));

  if (channel) {
    channel.send(new client.discord.MessageEmbed()
      .setAuthor(`${member.user.tag} (${member.id})`, member.user.avatarURL())
      .setFooter('User joined')
      .setColor(client.config.embed.color)
      .setTimestamp());
  }

  console.log(`${member.user.tag} has joined ${member.guild.name}.`);

  await client.models[member.guild.name].members.create({ name: member.user.tag, id: member.id });
};