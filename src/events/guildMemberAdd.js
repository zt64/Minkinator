const pluralize = require("pluralize");
const chalk = require("chalk");

module.exports = async (client, { guild, user }) => {
  const { config } = await global.sequelize.models.guild.findByPk(guild.id, { include: "config" });

  const users = pluralize("user", client.users.cache.size, true);
  const guilds = pluralize("guild", client.guilds.cache.size, true);

  client.user.setActivity(`${users} in ${guilds}`, { type: "WATCHING" });

  console.log(chalk`{yellow {bold ${user.tag}} has joined {bold ${guild.name}}.}`);

  const channel = guild.channels.cache.find(channel => channel.name === "member-log");

  if (channel) {
    return channel.send({
      embed: {
        color: config.colors.default,
        author: { iconURL: user.displayAvatarURL(), name: user.tag },
        footer: { text: "User Joined" }
      }
    });
  }
};