const pluralize = require("pluralize");
const chalk = require("chalk");

module.exports = async (client, guild) => {
  console.log(`Minkinator has joined: ${guild.name} (${guild.id}).`);

  await client.database.initialize(global.sequelize, guild);

  const botOwner = await client.users.fetch(global.config.ownerID);
  await botOwner.send(`Minkinator has been added to \`${guild.name} (${guild.id}\`).`);

  // Set count values
  const users = pluralize("user", client.users.cache.size, true);
  const guilds = pluralize("guild", client.guilds.cache.size, true);

  return client.user.setActivity(`${users} in ${guilds}`, { type: "WATCHING" });
};