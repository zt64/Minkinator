module.exports = async (client, member) => {
  const channel = member.guild.channels.cache.find(channel => channel.name.includes("member-log"));
  const database = client.databases[member.guild.name];
  const time = client.moment().format("HH:mm M/D/Y");

  console.log(`${`(${time})`.green} ${member.user.tag} has left ${member.guild.name}.`);

  if (!channel) return;

  channel.send(new client.Discord.MessageEmbed()
    .setAuthor(`${member.user.tag} (${member.id})`, member.user.avatarURL())
    .setColor(client.config.embed.color)
    .setFooter("User left")
  );

  return database.members.findByPk(member.id).then(data => data.destroy());
};