const pluralize = require("pluralize");
const chalk = require("chalk");

module.exports = async (client) => {
  const sequelize = global.sequelize = await client.database.create();

  for (const guild of client.guilds.cache.array()) {
    await client.database.initialize(sequelize, guild);
  }

  console.log(chalk`{green Initialized database for {bold ${client.guilds.cache.size}} ${pluralize("guild", client.guilds.cache.size)}.}`);

  // Pluralize user and guild counts
  const users = pluralize("user", client.users.cache.size, true);
  const guilds = pluralize("guild", client.guilds.cache.size, true);

  // Set the user activity
  await client.user.setActivity(`${users} in ${guilds}`, { type: "WATCHING" });

  return console.log(chalk`{inverse.green Minkinator is now online.}`);
};