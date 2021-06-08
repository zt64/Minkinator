const pluralize = require("pluralize");
const chalk = require("chalk");

module.exports = async (client, guild) => {
  console.log(chalk`{green Minkinator has left: {bold ${guild.name} (${guild.id})}.}`);

  const botOwner = await client.users.fetch(global.config.ownerID);
  await botOwner.send(`Minkinator has been removed from \`${guild.name} (${guild.id}\`).`);

  // Delete guild data
  const guildInstance = await global.sequelize.models.guild.findByPk(guild.id);
  await guildInstance.destroy();

  // Set count values
  const users = pluralize("user", client.users.cache.size, true);
  const guilds = pluralize("guild", client.guilds.cache.size, true);

  return client.user.setActivity(`${users} in ${guilds}`, { type: "WATCHING" });
};