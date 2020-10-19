module.exports = {
  description: "Leader board for user stats",
  aliases: ["lb"],
  parameters: [
    {
      name: "page",
      type: Number
    }
  ],
  async execute (client, message, [ page ]) {
    const guildConfig = global.guildInstance.config;
    const defaultColor = guildConfig.colors.default;
    const currency = guildConfig.currency;

    const { formatNumber } = global.functions;

    // Set members const and sort by balance
    const members = await global.guildInstance.getMembers({ order: [["balance", "DESC"]] });

    const pages = Math.ceil(members.length / 10);
    if (!page) page = 1;

    // Create embed
    const leaderBoardEmbed = new global.Discord.MessageEmbed()
      .setColor(defaultColor)
      .setTitle("Leader board")
      .setFooter(`Page ${page} of ${pages}`);

    if (page > pages || page < 1) return message.channel.send(`Page \`${page}\` does not exist.`);

    function populate () {
      members.slice((page - 1) * 10, page * 10).map((member, index) => {
        const tag = client.users.cache.get(member.userId).tag;
        leaderBoardEmbed.addField(`${index + 1 + (page - 1) * 10}. ${tag}:`, `${currency}${formatNumber(member.balance, 2)}`);
      });
    }

    populate();

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

      populate();

      leaderBoardEmbed.setFooter(`Page ${page} of ${pages}`);

      leaderBoardMessage.edit(leaderBoardEmbed);
    });
  }
};