module.exports = async (client, { guild, user }) => {
  const channel = guild.channels.cache.find(channel => channel.name === "member-log");
  if (!channel) return;

  const { pluralize, chalk } = global;
  const { config } = await global.sequelize.models.guild.findByPk(guild.id, { include: "config" });

  const users = pluralize("user", client.users.cache.size, true);
  const guilds = pluralize("guild", client.guilds.cache.size, true);
  client.user.setActivity(`${users} in ${guilds}.`, { type: "WATCHING" });

  const time = global.moment().format("HH:mm M/D/Y");
  console.log(chalk.green(`(${time})`), `${user.tag} has joined ${guild.name}.`);

  return channel.send(new global.Discord.MessageEmbed({
    color: config.colors.default,
    author: { iconURL: user.displayAvatarURL(), name: user.tag },
    footer: { text: "User Joined" }
  }));
};