module.exports = async (client, member) => {
  const channel = member.guild.channels.cache.find(channel => channel.name.includes("member-log"));
  const database = client.databases[member.guild.name];
  const time = client.moment().format("HH:mm M/D/Y");
  const pluralize = client.pluralize;

  // Set count values
  const users = pluralize("user", client.users.cache.size, true);
  const guilds = pluralize("guild", client.guilds.cache.size, true);

  client.user.setActivity(`${users} in ${guilds}.`, { type: "WATCHING" });

  console.log(`${`(${time})`.green} ${member.user.tag} has left ${member.guild.name}.`);

  // Destroy member data
  await database.members.findByPk(member.id).then(data => data.destroy());

  if (channel) {
    return channel.send(new client.Discord.MessageEmbed()
      .setColor(client.config.embed.color)
      .setAuthor(`${member.user.tag} (${member.id})`, member.user.avatarURL())
      .setFooter("User left")
    );
  }
};