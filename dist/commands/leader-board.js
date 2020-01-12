module.exports = {
    name: 'leader-board',
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
    async execute(client, message, args) {
        const members = await client.model.members.findAll({ order: [[args[0], 'DESC']] });
        const leaderBoardEmbed = new client.discord.MessageEmbed();
        let pages = Math.ceil(members.length / 10);
        const stat = args[0];
        const indexedPage = args[1] - 1 || 0;
        const nonIndexedPage = args[1] || 1;
        let page = 1;
        pages++;
        leaderBoardEmbed.setColor(client.config.embedColor);
        leaderBoardEmbed.setTitle(`Member ${args[0]} leader board`);
        leaderBoardEmbed.setFooter(`Page ${nonIndexedPage} of ${pages}`);
        leaderBoardEmbed.setTimestamp();
        if (!(stat in client.model.members.rawAttributes))
            return message.channel.send(`${stat} is not a statistic.`);
        if (nonIndexedPage > pages || nonIndexedPage < 1 || isNaN(nonIndexedPage))
            return message.channel.send(`Page ${nonIndexedPage} does not exist.`);
        members.slice(indexedPage * 10, nonIndexedPage * 10).map((member, index) => {
            leaderBoardEmbed.addField(`${index + 1 + indexedPage * 10}. ${member.name}:`, member[args[0]].toLocaleString());
        });
        const leaderBoardMessage = await message.channel.send(leaderBoardEmbed);
        if (pages > 1)
            leaderBoardMessage.react('➡️');
        leaderBoardMessage.react('❌');
        const filter = (reaction, user) => user.id === message.author.id && (reaction.emoji.name === '🏠' ||
            reaction.emoji.name === '⬅️' ||
            reaction.emoji.name === '➡️' ||
            reaction.emoji.name === '❌');
        const collector = leaderBoardMessage.createReactionCollector(filter);
        collector.on('collect', async (reaction) => {
            const emoji = reaction.emoji.name;
            switch (emoji) {
                case '🏠':
                    page = 1;
                    leaderBoardMessage.reactions.removeAll();
                    if (pages > 1)
                        leaderBoardMessage.react('➡️');
                    leaderBoardMessage.react('❌');
                    break;
                case '⬅️':
                    page--;
                    leaderBoardMessage.reactions.removeAll();
                    if (page !== 1)
                        leaderBoardMessage.react('🏠');
                    leaderBoardMessage.react('➡️');
                    leaderBoardMessage.react('❌');
                    break;
                case '➡️':
                    page++;
                    leaderBoardMessage.reactions.removeAll();
                    leaderBoardMessage.react('🏠');
                    leaderBoardMessage.react('⬅️');
                    if (pages > page)
                        leaderBoardMessage.react('➡️');
                    leaderBoardMessage.react('❌');
                    break;
                case '❌':
                    leaderBoardMessage.delete();
                    break;
            }
            leaderBoardMessage.edit(leaderBoardEmbed);
        });
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVhZGVyLWJvYXJkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL2xlYWRlci1ib2FyZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLENBQUMsT0FBTyxHQUFHO0lBQ2YsSUFBSSxFQUFFLGNBQWM7SUFDcEIsV0FBVyxFQUFFLDZCQUE2QjtJQUMxQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUM7SUFDZixVQUFVLEVBQUU7UUFDVjtZQUNFLElBQUksRUFBRSxNQUFNO1lBQ1osSUFBSSxFQUFFLE1BQU07WUFDWixRQUFRLEVBQUUsSUFBSTtTQUNmO1FBQ0Q7WUFDRSxJQUFJLEVBQUUsTUFBTTtZQUNaLElBQUksRUFBRSxNQUFNO1NBQ2I7S0FDRjtJQUNELEtBQUssQ0FBQyxPQUFPLENBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJO1FBQ2xDLE1BQU0sT0FBTyxHQUFHLE1BQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN4RyxNQUFNLGdCQUFnQixHQUFHLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUMzRCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDM0MsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXJCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENB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