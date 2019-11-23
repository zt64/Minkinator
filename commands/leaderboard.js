module.exports = {
  name: 'leaderboard',
  description: 'Leardboard for user stats',
  usage: '[stat] <page>',
  aliases: ['lb'],
  args: true,
  async execute (client, message, args) {
    const members = await client.models[message.guild.name].members.findAll({ order: [[args[0], 'DESC']] });
    const leaderboard = new client.discord.MessageEmbed();
    const pages = Math.ceil(members.length / 10);
    const stat = args[0];

    const indexedPage = args[1] - 1 || 0;
    const nonIndexedPage = args[1] || 1;

    leaderboard.setColor('#34eb3d');
    leaderboard.setTitle(`Member ${args[0]} leaderboard`);
    leaderboard.setFooter(`Page ${nonIndexedPage} of ${pages}`);
    leaderboard.setTimestamp();

    if (!(stat in client.models[message.guild.name].members.rawAttributes)) return message.channel.send(`${stat} is not a statistic.`);
    if (nonIndexedPage > pages || nonIndexedPage < 1 || isNaN(nonIndexedPage)) return message.channel.send(`Page ${nonIndexedPage} does not exist.`);

    members.slice(indexedPage * 10, nonIndexedPage * 10).map((member, index) => {
      leaderboard.addField(`${index + 1 + indexedPage * 10}. ${member.name}:`, member[args[0]].toLocaleString(), true);
    });

    return message.channel.send(leaderboard);
  }
};
