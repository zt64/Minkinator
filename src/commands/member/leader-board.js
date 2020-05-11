module.exports = {
  description: 'Leader board for user stats',
  aliases: ['lb'],
  parameters: [
    {
      name: 'stat',
      type: String,
      required: true
    },
    {
      name: 'page',
      type: Number
    }
  ],
  async execute (client, message, args) {
    const stat = args[0];

    if (!(stat in client.database.members.rawAttributes)) return message.channel.send(`\`${stat}\` is not a member statistic.`);

    const guildConfig = await client.database.properties.findByPk('configuration').then(key => key.value);
    const successColor = guildConfig.embedColors.success;

    const members = await client.database.members.findAll({ order: [[stat, 'DESC']] });
    const leaderBoardEmbed = new client.Discord.MessageEmbed();
    const pages = Math.ceil(members.length / 10);

    let page = args[1] || 1;

    leaderBoardEmbed.setColor(successColor);
    leaderBoardEmbed.setTitle(`Member ${stat} leader board`);
    leaderBoardEmbed.setFooter(`Page ${page} of ${pages}`);

    if (page > pages || page < 1 || isNaN(page)) return message.channel.send(`Page \`${page}\` does not exist.`);

    members.slice((page - 1) * 10, page * 10).map((member, index) => {
      leaderBoardEmbed.addField(`${index + 1 + (page - 1) * 10}. ${member.name}:`, member[stat].toLocaleString());
    });

    const leaderBoardMessage = await message.channel.send(leaderBoardEmbed);

    if (pages > 1) leaderBoardMessage.react('➡️');

    leaderBoardMessage.react('❌');

    const filter = (reaction, user) => user.id === message.author.id && (
      ['🏠', '⬅️', '➡️', '❌'].map(emoji => reaction.emoji.name === emoji)
    );

    const collector = leaderBoardMessage.createReactionCollector(filter);

    collector.on('collect', async reaction => {
      const emoji = reaction.emoji.name;

      switch (emoji) {
        case '🏠':
          page = 1;

          leaderBoardMessage.reactions.removeAll();

          if (pages > 1) leaderBoardMessage.react('➡️');

          leaderBoardMessage.react('❌');
          break;
        case '⬅️':
          page--;

          leaderBoardMessage.reactions.removeAll();

          if (page !== 1) leaderBoardMessage.react('🏠');

          leaderBoardMessage.react('➡️');
          leaderBoardMessage.react('❌');
          break;
        case '➡️':
          page++;

          leaderBoardMessage.reactions.removeAll();

          leaderBoardMessage.react('🏠');
          leaderBoardMessage.react('⬅️');

          if (pages > page) leaderBoardMessage.react('➡️');

          leaderBoardMessage.react('❌');
          break;
        case '❌':
          return leaderBoardMessage.delete();
      }

      leaderBoardEmbed.fields = [];

      members.slice((page - 1) * 10, page * 10).map((member, index) => {
        leaderBoardEmbed.addField(`${index + 1 + (page - 1) * 10}. ${member.name}:`, member[stat].toLocaleString());
      });

      leaderBoardEmbed.setFooter(`Page ${page} of ${pages}`);

      leaderBoardMessage.edit(leaderBoardEmbed);
    });
  }
};