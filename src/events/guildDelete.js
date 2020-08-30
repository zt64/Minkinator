module.exports = async (client, guild) => {
  const time = global.Moment().format("HH:mm M/D/Y");
  const pluralize = global.pluralize;

  console.log(`${`(${time})`.green} Minkinator has joined: ${guild.name} (${guild.id}).`);

  // Delete database
  await client.databases[guild.name].sequelize.drop();
  await global.fs.unlinkSync(`./data/${guild.id}.sqlite`);

  // Set count values
  const users = pluralize("user", client.users.cache.size, true);
  const guilds = pluralize("guild", client.guilds.cache.size, true);

  return client.user.setActivity(`${users} in ${guilds}.`, { type: "WATCHING" });
};