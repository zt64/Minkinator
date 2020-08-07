module.exports = async (client, guild) => {
  const time = client.moment().format("HH:mm M/D/Y");
  const pluralize = client.pluralize;

  console.log(`${`(${time})`.green} Minkinator has joined: ${guild.name} (${guild.id}).`);

  await client.databases[guild.name].sequelize.drop();
  await client.fs.unlinkSync(`./data/${guild.id}.sqlite`);

  const users = pluralize("user", client.users.cache.size, true);
  const guilds = pluralize("guild", client.guilds.cache.size, true);

  return client.user.setActivity(`${users} in ${guilds}.`, { type: "WATCHING" });
};