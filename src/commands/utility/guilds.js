module.exports = {
  description: "Shows the current guilds and members Minkinator is watching.",
  aliases: ["servers"],
  async execute (client, message, [ page ]) {
    const { colors } = global.guildInstance.config;

    const guilds = client.guilds.cache.array();
    const pages = Math.ceil(guilds.length / 10);

    if (!page) page = 1;

    if (page > pages || page < 1) return message.channel.send(`Page \`${page}\` does not exist.`);

    const guildsEmbed = new global.Discord.MessageEmbed()
      .setColor(colors.default)
      .setTitle(`Watching ${global.pluralize("guild", guilds.length, true)} and ${client.users.cache.size} users`)
      .setFooter(`Page ${page} of ${pages}`);

    function populate () {
      guilds.slice((page - 1) * 10, page * 10).map((guild) => {
        guildsEmbed.addField(`${guild.name}`, `Members: ${guild.memberCount} \n ID: ${guild.id}`);
      });
    }

    populate();

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

        populate();

        guildsMessage.reactions.removeAll();

        if (pages > 1) guildsMessage.react("➡️");
        break;
      case "⬅️":
        page--;

        populate();

        guildsMessage.reactions.removeAll();

        if (page !== 1) guildsMessage.react("🏠");

        guildsMessage.react("➡️");
        break;
      case "➡️":
        page++;

        populate();

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