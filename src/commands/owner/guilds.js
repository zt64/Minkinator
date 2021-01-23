const pluralize = require("pluralize");

module.exports = {
  description: "Shows the current guilds and members Minkinator is watching.",
  aliases: ["servers"],
  async execute (client, message, [ page ]) {
    const { colors } = await global.sequelize.models.guildConfig.findByPk(message.guild.id);
    const guilds = client.guilds.cache.array();
    const pages = Math.ceil(guilds.length / 10);

    if (!page) page = 1;

    if (page > pages || page < 1) return message.channel.send(`Page \`${page}\` does not exist.`);

    const guildsEmbed = new Discord.MessageEmbed({
      color: colors.default,
      title: `Watching ${pluralize("guild", guilds.length, true)} and ${client.users.cache.size} users`,
      footer: { text: `Page ${page} of ${pages}` }
    });

    util.paginate(guilds, 10, page).forEach(guild => {
      guildsEmbed.addField(`${guild.name}`, `Members: ${guild.memberCount} \n ID: ${guild.id}`);
    });

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

        if (page > 2) guildsMessage.react("🏠");

        guildsMessage.react("➡️");
        break;
      case "➡️":
        page++;

        guildsMessage.reactions.removeAll();

        if (page > 2) guildsMessage.react("🏠");
        guildsMessage.react("⬅️");

        if (pages > page) guildsMessage.react("➡️");
      }

      guildsEmbed.fields = [];

      util.paginate(guilds, 10, page).forEach(guild => {
        guildsEmbed.addField(`${guild.name}`, `Members: ${guild.memberCount} \n ID: ${guild.id}`);
      });

      guildsEmbed.setFooter(`Page ${page} of ${pages}`);
      guildsMessage.edit(guildsEmbed);
    });
  }
};

// const buttons = {
//   HOME: "🏠",
//   LEFT: "⬅️",
//   RIGHT: "➡️",
// }

// collector.on("collect", async reaction => {
// const emoji = reaction.emoji.name;
// guildsMessage.reactions.removeAll();

// if (page > 2) guildsMessage.react(buttons.HOME);

// switch (emoji) {
//   case buttons.HOME:
//     page = 1;
//     if (pages > 1) guildsMessage.react(buttons.RIGHT);
//   case buttons.LEFT:
//     page--;
//     guildsMessage.react(buttons.RIGHT);
//   case buttons.RIGHT:
//     page++;
//     if (pages > page) guildsMessage.react(buttons.RIGHT);
//     guildsMessage.react(buttons.LEFT);
// }
// });