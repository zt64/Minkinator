module.exports = async (client, guild) => {
  const { moment, chalk, pluralize } = global;
  const time = moment().format("HH:mm M/D/Y");

  console.log(chalk.green(`(${time})`), `Minkinator has joined: ${guild.name} (${guild.id}).`);

  // Populate database
  await client.databases.populate(client, guild, await client.databases.create(client, guild));

  // Set count values
  const users = pluralize("user", client.users.cache.size, true);
  const guilds = pluralize("guild", client.guilds.cache.size, true);

  return client.user.setActivity(`${users} in ${guilds}.`, { type: "WATCHING" });
};