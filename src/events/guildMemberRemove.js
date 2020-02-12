module.exports = async (client, member) => {
  const channel = member.guild.channels.find(channel => channel.name.includes('member-log'));

  if (channel) {
    channel.send(new client.discord.MessageEmbed()
      .setAuthor(`${member.user.tag} (${member.id})`, member.user.avatarURL())
      .setFooter('User left')
      .setColor(client.config.embed.color)
      .setTimestamp());
  }

  console.log(`${member.user.tag} has left ${member.guild.name}.`);

  (await client.models[member.guild.name].members.findByPk(member.id)).destroy();
};