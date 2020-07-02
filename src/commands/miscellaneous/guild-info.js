module.exports = {
  description: "Show guild information.",
  aliases: ["gi", "guildinfo"],
  async execute (client, message, args) {
    const guildConfig = await client.database.properties.findByPk("configuration").then(key => key.value);
    const successColor = guildConfig.colors.success;

    const guild = message.guild;

    const createdAt = client.moment(guild.createdAt).format("MM/DD/YYYY");

    const infoEmbed = new client.Discord.MessageEmbed()
      .setColor(successColor)
      .setThumbnail(guild.iconURL())
      .setTitle("Guild Information")
      .addField("Name:", guild.name, true)
      .addField("ID:", guild.id, true)
      .addField("Owner:", guild.owner, true)
      .addField("Roles:", guild.roles.cache.size, true)
      .addField("Features:", guild.features.length >= 1 ? guild.features : "None", true)
      .addField("Channels:", guild.channels.cache.size, true)
      .addField("Created:", createdAt, true)
      .addField("Emojis:", guild.emojis.cache.size, true)
      .addField("Members:", guild.members.cache.size, true)
      .addField("Maximum Members:", guild.maximumMembers || "None", true)
      .addField("Region:", guild.region, true);

    if (guild.description) infoEmbed.setDescription(guild.description);

    return message.channel.send(infoEmbed);
  }
};