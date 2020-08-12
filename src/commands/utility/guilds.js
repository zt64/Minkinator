module.exports = {
  description: "Shows the current guilds and members Minkinator is watching.",
  aliases: ["servers"],
  async execute (client, message, args) {
    const guildConfig = await client.database.properties.findByPk("configuration").then(key => key.value);
    const defaultColor = guildConfig.colors.default;

    const guilds = client.guilds.cache;
    const pages = Math.ceil(guilds.size / 10);

    let page = args[0] || 1;

    const guildsEmbed = new client.Discord.MessageEmbed()
      .setColor(defaultColor)
      .setTitle(`Watching ${client.pluralize("guild", guilds.size, true)} and ${client.users.cache.size} users`)
      .setFooter(`Page ${page} of ${pages}`);

    guilds.map(guild => guildsEmbed.addField(`${guild.name}`, `Members: ${guild.memberCount} \n ID: ${guild.id}`));

    const guildsMessage = await message.channel.send(guildsEmbed);

    if (pages > 1) guildsMessage.react("➡️");

    // Set up reaction collector
    const filter = (reaction, user) => user.id === message.author.id;
   
    const collector = guildsMessage.createReactionCollector(filter);

    collector.on("collect", async reaction => {
      const emoji = reaction.emoji.name;

      switch (emoji) {
        case "🏠":
          page = 1;

          guildsMessage.reactions.removeAll();

          if (pages > 1) guildsMessage.react("➡️");
          break;
        case "⬅️":
          page--;

          guildsMessage.reactions.removeAll();

          if (page !== 1) guildsMessage.react("🏠");

          guildsMessage.react("➡️");
          break;
        case "➡️":
          page++;

          guildsMessage.reactions.removeAll();

          guildsMessage.react("🏠");
          guildsMessage.react("⬅️");

          if (pages > page) guildsMessage.react("➡️");
          break;
      }

      guildsEmbed.fields = [];

      guildsEmbed.setFooter(`Page ${page} of ${pages}`);

      guildsMessage.edit(guildsEmbed);
    });
  }
};