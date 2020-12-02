module.exports = async (client, member) => {
  const { guild } = member;
  const channel = guild.channels.cache.find(channel => channel.name === "member-log");

  if (!channel) return;

  const { pluralize, chalk } = global;

  const time = global.moment().format("HH:mm M/D/Y");

  const { models } = global.sequelize;

  const guildInstance = await models.guild.findByPk(guild.id, { include: "config" });
  const defaultColor = guildInstance.config.colors.default;

  // Set count values
  const users = pluralize("user", client.users.cache.size, true);
  const guilds = pluralize("guild", client.guilds.cache.size, true);

  // Update bot activity
  client.user.setActivity(`${users} in ${guilds}.`, { type: "WATCHING" });

  console.log(chalk.green(`(${time})`), `${member.user.tag} has left ${guild.name}`);

  // Destroy member data
  await models.member.findByPk(member.id).then(data => data.destroy());

  // Send embed
  return channel.send(new global.Discord.MessageEmbed()
    .setColor(defaultColor)
    .setAuthor(`${member.user.tag} (${member.id})`, member.user.displayAvatarURL())
    .setFooter("User left")
  );
};