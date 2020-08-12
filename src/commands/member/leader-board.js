module.exports = {
  description: "Leader board for user stats",
  aliases: ["lb"],
  parameters: [
    {
      name: "page",
      type: Number
    }
  ],
  async execute (client, message, args) {
    const guildConfig = await client.database.properties.findByPk("configuration").then(key => key.value);
    const defaultColor = guildConfig.colors.default;
    const currency = guildConfig.currency;

    const { formatNumber } = client.functions;

    // Set members const and sort by balance
    const members = await client.database.members.findAll({ order: [["balance", "DESC"]] });

    const pages = Math.ceil(members.length / 10);
    let page = args[0] || 1;

    // Create embed
    const leaderBoardEmbed = new client.Discord.MessageEmbed()
      .setColor(defaultColor)
      .setTitle("Leader board")
      .setFooter(`Page ${page} of ${pages}`);

    if (page > pages || page < 1) return message.channel.send(`Page \`${page}\` does not exist.`);

    function populateLeaderBoard () {
      members.slice((page - 1) * 10, page * 10).map((member, index) => {
        leaderBoardEmbed.addField(`${index + 1 + (page - 1) * 10}. ${client.users.cache.get(member.id).tag}:`, `${currency}${formatNumber(member.balance, 2)}`);
      });
    }

    populateLeaderBoard();

    const leaderBoardMessage = await message.channel.send(leaderBoardEmbed);

    if (pages > 1) leaderBoardMessage.react("➡️");

    const filter = (reaction, user) => user.id === message.author.id;

    const collector = leaderBoardMessage.createReactionCollector(filter);

    collector.on("collect", async reaction => {
      const emoji = reaction.emoji.name;

      switch (emoji) {
        case "🏠":
          page = 1;

          leaderBoardMessage.reactions.removeAll();

          if (pages > 1) leaderBoardMessage.react("➡️");
          break;
        case "⬅️":
          page--;

          leaderBoardMessage.reactions.removeAll();

          if (page !== 1) leaderBoardMessage.react("🏠");

          leaderBoardMessage.react("➡️");
          break;
        case "➡️":
          page++;

          leaderBoardMessage.reactions.removeAll();

          leaderBoardMessage.react("🏠");
          leaderBoardMessage.react("⬅️");

          if (pages > page) leaderBoardMessage.react("➡️");
          break;
      }

      leaderBoardEmbed.fields = [];

      populateLeaderBoard();

      leaderBoardEmbed.setFooter(`Page ${page} of ${pages}`);

      leaderBoardMessage.edit(leaderBoardEmbed);
    });
  }
};