const pluralize = require("pluralize");
const chalk = require("chalk");

module.exports = async (client) => {
  const sequelize = global.sequelize = await client.database.create();

  for (const guild of client.guilds.cache.array()) await client.database.initialize(guild, sequelize);

  console.log(chalk.green(`(${util.time()})`), `Initialized database for ${pluralize("guild", client.guilds.cache.size, true)}.`);

  // Pluralize user and guild counts
  const users = pluralize("user", client.users.cache.size, true);
  const guilds = pluralize("guild", client.guilds.cache.size, true);

  // Set the user activity
  client.user.setPresence({ status: "watching", activity: { name: `${users} in ${guilds}` } });

  return console.log(chalk.green(`(${util.time()})`), "Minkinator is now online.");
};