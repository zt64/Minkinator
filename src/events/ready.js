module.exports = async (client) => {
  const { moment, chalk, pluralize } = global;
  const time = moment().format("HH:mm M/D/Y");

  const sequelize = await client.database.create();

  // Create and populate the databases for each guild
  for (const guild of client.guilds.cache.array()) {
    await client.database.populate(guild, sequelize);
  }

  global.sequelize = sequelize;

  console.log(chalk.green(`(${time})`), `Initialized database for ${pluralize("guild", client.guilds.cache.size, true)}.`);

  // Set count values
  const users = pluralize("user", client.users.cache.size, true);
  const guilds = pluralize("guild", client.guilds.cache.size, true);

  // Set activity
  client.user.setActivity(`${users} in ${guilds}.`, { type: "WATCHING" });

  return console.log(chalk.green(`(${time})`), "Minkinator is now online.");
};