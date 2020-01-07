module.exports = {
    name: 'guess',
    description: 'Guess a number 1 - 100 to earn a reward.',
    parameters: [
        {
            name: 'guess',
            type: Number,
            required: true
        }
    ],
    coolDown: '120',
    async execute(client, message, args) {
        const member = await client.models[message.guild.name].members.findByPk(message.author.id);
        const currency = client.config.currency;
        const guess = Math.floor(args[0]);
        const value = Math.round(Math.random() * 100);
        const earn = value !== guess ? Math.round(50 / Math.abs(value - guess) * 4) : 1000;
        await member.update({ balance: member.balance + earn });
        return message.channel.send(new client.discord.MessageEmbed()
            .setColor(client.config.embedColor)
            .setTitle('Number Guessing Game')
            .setDescription(`You guessed ${guess}, and the number was ${value}. \n Earning you ${currency}${earn} puts your balance at ${currency}${member.balance.toLocaleString()}`)
            .setFooter(message.author.id)
            .setTimestamp());
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3Vlc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvZ3Vlc3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxDQUFDLE9BQU8sR0FBRztJQUNmLElBQUksRUFBRSxPQUFPO0lBQ2IsV0FBVyxFQUFFLDBDQUEwQztJQUN2RCxVQUFVLEVBQUU7UUFDVjtZQUNFLElBQUksRUFBRSxPQUFPO1lBQ2IsSUFBSSxFQUFFLE1BQU07WUFDWixRQUFRLEVBQUUsSUFBSTtTQUNmO0tBQ0Y7SUFDRCxRQUFRLEVBQUUsS0FBSztJQUNmLEtBQUssQ0FBQyxPQUFPLENBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJO1FBQ2xDLE1BQU0sTUFBTSxHQUFHLE1BQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMzRixNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUN4QyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWxDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQzlDLE1BQU0sSUFBSSxHQUFHLEtBQUssS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFFbkYsTUFBTSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUV4RCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUU7YUFDMUQsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO2FBQ2xDLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQzthQUNoQyxjQUFjLENBQUMsZUFBZSxLQUFLLHdCQUF3QixLQUFLLG9CQUFvQixRQUFRLEdBQUcsSUFBSSx5QkFBeUIsUUFBUSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLEVBQUUsQ0FBQzthQUN6SyxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7YUFDNUIsWUFBWSxFQUFFLENBQUMsQ0FBQztJQUNyQixDQUFDO0NBQ0YsQ0FBQyJ9