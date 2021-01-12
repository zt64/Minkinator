const pluralize = require("pluralize");
const moment = require("moment");
const chalk = require("chalk");

module.exports = async (client, guild) => {
  const time = moment().format("HH:mm M/D/Y");

  console.log(chalk.green(`(${time})`), `Minkinator has left: ${guild.name} (${guild.id}).`);

  // Delete guild data
  const guildInstance = await global.sequelize.models.guild.findByPk(guild.id);
  await guildInstance.destroy();

  // Set count values
  const users = pluralize("user", client.users.cache.size, true);
  const guilds = pluralize("guild", client.guilds.cache.size, true);

  return client.user.setActivity(`${users} in ${guilds}.`, { type: "WATCHING" });
};