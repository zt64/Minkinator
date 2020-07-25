module.exports = {
  description: "Shows the current guilds and members Minkinator is watching.",
  aliases: ["servers"],
  async execute (client, message, args) {
    const guildConfig = await client.database.properties.findByPk("configuration").then(key => key.value);
    const successColor = guildConfig.colors.success;

    const guilds = client.guilds.cache;

    const guildsEmbed = new client.Discord.MessageEmbed()
      .setColor(successColor)
      .setTitle(`Watching ${client.pluralize("guild", guilds.size, true)} and ${client.users.cache.size} users`);

    guilds.map(guild => guildsEmbed.addField(`${guild.name}`, `Members: ${guild.memberCount} \n ID: ${guild.id}`));

    return message.channel.send(guildsEmbed);
  }
};