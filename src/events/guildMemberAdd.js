const pluralize = require("pluralize");
const Discord = require("discord.js");
const chalk = require("chalk");

module.exports = async (client, { guild, user }) => {
  const channel = guild.channels.cache.find(channel => channel.name === "member-log");
  if (!channel) return;

  const { config } = await global.sequelize.models.guild.findByPk(guild.id, { include: "config" });

  const users = pluralize("user", client.users.cache.size, true);
  const guilds = pluralize("guild", client.guilds.cache.size, true);

  client.user.setActivity(`${users} in ${guilds}`, { type: "WATCHING" });

  console.log(chalk.green(`(${util.time()})`), `${user.tag} has joined ${guild.name}.`);

  return channel.send(new Discord.MessageEmbed({
    color: config.colors.default,
    author: { iconURL: user.displayAvatarURL(), name: user.tag },
    footer: { text: "User Joined" }
  }));
};