const pluralize = require("pluralize");
const chalk = require("chalk");

module.exports = async (client, guild) => {
  console.log(chalk.green(`(${util.time()})`), `Minkinator has left: ${guild.name} (${guild.id}).`);

  // Delete guild data
  const guildInstance = await global.sequelize.models.guild.findByPk(guild.id);
  await guildInstance.destroy();

  // Set count values
  const users = pluralize("user", client.users.cache.size, true);
  const guilds = pluralize("guild", client.guilds.cache.size, true);

  return client.user.setPresence({ status: "watching", activity: { name: `${users} in ${guilds}` } });
};