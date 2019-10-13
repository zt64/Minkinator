module.exports = {
  name: 'leaderboard',
  description: 'Leardboard for user stats',
  usage: '[stat] <page>',
  aliases: ['lb'],
  args: true,
  async execute (client, message, args) {
    const members = await client.models.members.findAll({ order: [[args[0], 'DESC']], limit: 10 });
    const leaderboard = new client.discord.RichEmbed();

    if (!(args[0] in client.models.members.rawAttributes)) return message.channel.send(`${args[0]} is not a statistic.`);

    leaderboard.setColor('#34eb3d');
    leaderboard.setTitle(`Member ${args[0]} leaderboard`);
    leaderboard.setFooter(`Page ${args[1] || 1} of `);
    leaderboard.setTimestamp();

    members.map((object, index) => leaderboard.addField(`${index + 1}. ${object.name}:`, object[args[0]], true));

    return message.channel.send(leaderboard);
  }
};
