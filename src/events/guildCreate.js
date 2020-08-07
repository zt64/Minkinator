module.exports = async (client, guild) => {
  const time = client.moment().format("HH:mm M/D/Y");
  const pluralize = client.pluralize;

  console.log(`${`(${time})`.green} Minkinator has joined: ${guild.name} (${guild.id}).`);

  await client.databases.populate(client, guild, await client.databases.create(client, guild));

  const users = pluralize("user", client.users.cache.size, true);
  const guilds = pluralize("guild", client.guilds.cache.size, true);

  return client.user.setActivity(`${users} in ${guilds}.`, { type: "WATCHING" });
};