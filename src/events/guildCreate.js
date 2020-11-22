module.exports = async (client, guild) => {
  const { moment, chalk, pluralize } = global;
  const time = moment().format("HH:mm M/D/Y");

  console.log(chalk.green(`(${time})`), `Minkinator has joined: ${guild.name} (${guild.id}).`);

  await client.database.initialize(guild, global.sequelize);

  // Set count values
  const users = pluralize("user", client.users.cache.size, true);
  const guilds = pluralize("guild", client.guilds.cache.size, true);

  return client.user.setActivity(`${users} in ${guilds}.`, { type: "WATCHING" });
};