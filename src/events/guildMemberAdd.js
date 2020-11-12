module.exports = async (client, member) => {
  const { guild } = member;
  const channel = guild.channels.cache.find(channel => channel.name === "member-log");

  if (!channel) return;

  const { pluralize, chalk } = global;

  const time = global.moment().format("HH:mm M/D/Y");

  const guildConfig = await global.sequelize.models.guild.findByPk(guild.id, { include: global.sequelize.models.guildConfig });
  const defaultColor = guildConfig.colors.default;

  // Set count values
  const users = pluralize("user", client.users.cache.size, true);
  const guilds = pluralize("guild", client.guilds.cache.size, true);

  // Update bot activity
  client.user.setActivity(`${users} in ${guilds}.`, { type: "WATCHING" });

  console.log(chalk.green(`(${time})`), `${member.user.tag} has joined ${guild.name}`);

  // Send embed
  return channel.send(new global.Discord.MessageEmbed()
    .setColor(defaultColor)
    .setAuthor(`${member.user.tag} (${member.id})`, member.user.displayAvatarURL())
    .setFooter("User joined")
  );
};