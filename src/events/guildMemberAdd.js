module.exports = async (client, member) => {
  const channel = member.guild.channels.cache.find(channel => channel.name.includes("member-log"));
  const database = client.databases[member.guild.name];
  const time = client.moment().format("HH:mm M/D/Y");

  console.log(`${`(${time})`.green} ${member.user.tag} has joined ${member.guild.name}.`);

  await database.members.create({ name: member.user.tag, id: member.id });

  if (!channel) return;

  return channel.send(new client.Discord.MessageEmbed()
    .setColor(client.config.embed.color)
    .setAuthor(`${member.user.tag} (${member.id})`, member.user.avatarURL())
    .setFooter("User joined")
    .setTimestamp()
  );
};