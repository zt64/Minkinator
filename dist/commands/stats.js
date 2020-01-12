module.exports = {
    name: 'stats',
    description: 'Displays a members statistics.',
    aliases: ['bal', 'balance', 'statistics', 'userinfo', 'level', 'lvl'],
    parameters: [
        {
            name: 'member',
            type: String
        }
    ],
    async execute(client, message, args) {
        const user = message.mentions.users.first() || message.author;
        const member = message.guild.member(user);
        const memberData = await client.model.members.findByPk(user.id);
        return message.channel.send(new client.discord.MessageEmbed()
            .setColor(client.config.embedColor)
            .setAuthor(`Statistics for ${member.nickname || user.tag}`, user.avatarURL())
            .addField('Balance:', `${client.config.currency}${memberData.balance.toLocaleString()}`, true)
            .addField('Level:', memberData.level.toLocaleString(), true)
            .addField('Total experience:', `${memberData.xp.toLocaleString()} XP`, true)
            .addField('Total messages:', memberData.messages.toLocaleString(), true)
            .addField('Joined:', member.joinedAt.toLocaleDateString(), true)
            .addField('Created:', user.createdAt.toLocaleDateString(), true)
            .addField('Status:', member.presence.status, true)
            .setFooter(`${memberData.id}`)
            .setTimestamp());
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvc3RhdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxDQUFDLE9BQU8sR0FBRztJQUNmLElBQUksRUFBRSxPQUFPO0lBQ2IsV0FBVyxFQUFFLGdDQUFnQztJQUM3QyxPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQztJQUNyRSxVQUFVLEVBQUU7UUFDVjtZQUNFLElBQUksRUFBRSxRQUFRO1lBQ2QsSUFBSSxFQUFFLE1BQU07U0FDYjtLQUNGO0lBQ0QsS0FBSyxDQUFDLE9BQU8sQ0FBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUk7UUFDbEMsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUM5RCxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxQyxNQUFNLFVBQVUsR0FBRyxNQUFNLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUVyRixPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUU7YUFDMUQsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO2FBQ2xDLFNBQVMsQ0FBQyxrQkFBa0IsTUFBTSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO2FBQzVFLFFBQVEsQ0FBQyxVQUFVLEVBQUUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDO2FBQzdGLFFBQVEsQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsRUFBRSxJQUFJLENBQUM7YUFDM0QsUUFBUSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsVUFBVSxDQUFDLEVBQUUsQ0FBQyxjQUFjLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQzthQUMzRSxRQUFRLENBQUMsaUJBQWlCLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsRUFBRSxJQUFJLENBQUM7YUFDdkUsUUFBUSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLGtCQUFrQixFQUFFLEVBQUUsSUFBSSxDQUFDO2FBQy9ELFFBQVEsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLElBQUksQ0FBQzthQUMvRCxRQUFRLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQzthQUNqRCxTQUFTLENBQUMsR0FBRyxVQUFVLENBQUMsRUFBRSxFQUFFLENBQUM7YUFDN0IsWUFBWSxFQUFFLENBQUMsQ0FBQztJQUNyQixDQUFDO0NBQ0YsQ0FBQyJ9