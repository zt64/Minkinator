module.exports = {
  name: 'leaderboard',
  description: 'Leardboard for user stats',
  usage: '[stat] <page>',
  args: true,
  async execute (client, message, args) {
    const members = await client.models.members.findAll({ order: [[args[0], 'DESC']], limit: 10 });
    const leaderboard = new client.discord.RichEmbed();

    leaderboard.setColor('#34eb3d');
    leaderboard.setTitle(`Member ${args[0]} leaderboard`);
    leaderboard.setFooter('Page 1 of');
    leaderboard.setTimestamp();

    members.map(object => leaderboard.addField(`num. ${object.name}:`, object[args[0]], true));

    return message.channel.send(leaderboard);
  }
};
