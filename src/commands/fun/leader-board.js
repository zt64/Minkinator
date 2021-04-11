module.exports = {
  description: "Shows the leader board for member balances.",
  aliases: [ "lb" ],
  parameters: [
    {
      name: "page",
      type: Number
    }
  ],
  async execute (client, message, [ page ]) {
    const guildInstance = await global.sequelize.models.guild.findByPk(message.guild.id, { include: { all: true, nested: true } });
    const {  currency } = guildInstance.config;

    // Set members const and sort by balance
    const members = await guildInstance.getMembers({ order: [ [ "balance", "DESC" ] ] });

    const pages = Math.ceil(members.length / 10);
    if (!page) page = 1;

    // Create embed
    const leaderBoardEmbed = new Discord.MessageEmbed({
      color: global.config.colors.default,
      title: "Leader Board",
      footer: `Page ${page} of ${pages}`
    });

    if (page > pages || page < 1) return message.reply(`Page \`${page}\` does not exist.`);

    function populate () {
      members.slice((page - 1) * 10, page * 10).map((member, index) => {
        const { tag } = client.users.cache.get(member.userId);
        leaderBoardEmbed.addField(`${index + 1 + (page - 1) * 10}. ${tag}:`, `${currency}${util.formatNumber(member.balance, 2)}`);
      });
    }

    populate();

    const leaderBoardMessage = await message.reply(leaderBoardEmbed);

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
    });

    collector.on("collect", async reaction => {
      const emoji = reaction.emoji.name;

      leaderBoardEmbed.fields = [];

      util.paginate(members, 10, page).forEach((member, index) => {
        const { tag } = client.users.cache.get(member.userId);
        leaderBoardEmbed.addField(`${index}. ${tag}:`, `${currency}${util.formatNumber(member.balance, 2)}`);
      });

      leaderBoardEmbed.setFooter(`Page ${page} of ${pages}`);

      leaderBoardMessage.reactions.resolve(emoji).users.remove(message.author);

      await leaderBoardMessage.edit(leaderBoardEmbed);
    });
  }
};