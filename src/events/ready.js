const pluralize = require("pluralize");
const chalk = require("chalk");

module.exports = async (client) => {
  const sequelize = global.sequelize = await client.database.create();

  client.guilds.cache.forEach(async guild => await client.database.initialize(guild, sequelize));

  console.log(chalk.green(`(${util.time()})`), `Initialized database for ${pluralize("guild", client.guilds.cache.size, true)}.`);

  // Pluralize user and guild counts
  const users = pluralize("user", client.users.cache.size, true);
  const guilds = pluralize("guild", client.guilds.cache.size, true);

  // Set the user activity
  client.user.setActivity(`${users} in ${guilds}`, { type: "WATCHING" });

  return console.log(chalk.green(`(${util.time()})`), "Minkinator is now online.");
};