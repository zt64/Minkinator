module.exports = {
    name: 'mute',
    category: 'Administrator',
    description: 'Mutes a member.',
    permissions: ['MANAGE_CHANNELS'],
    parameters: [
        {
            name: 'member',
            type: String,
            required: true
        },
        {
            name: 'time',
            type: Number
        },
        {
            name: 'reason',
            type: String
        }
    ],
    async execute(client, message, args) {
        if (!message.mentions.members.first())
            return message.reply(`${message.mentions.members.first()} is not a valid member.`);
        const member = message.mentions.members.first();
        await member.roles.add('625385600081592321');
        message.channel.send(new client.discord.MessageEmbed()
            .setColor(client.config.embedColor)
            .setAuthor(`${member.user.tag} has been muted${args[1] ? ` for ${args[1]} minute(s)` : ''}.`, member.user.avatarURL())
            .setDescription(args[2] ? args.slice(2).join(' ') : 'No reason provided.')
            .setFooter(member.id)
            .setTimestamp());
        if (args[1]) {
            setTimeout(() => {
                member.removeRole('625385600081592321');
                return message.channel.send(new client.discord.MessageEmbed()
                    .setColor(client.config.embedColor)
                    .setAuthor(`${member.user.tag} has been unmuted`, member.user.avatarURL)
                    .setFooter(member.id)
                    .setTimestamp());
            }, client.functions.convertTime());
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXV0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9tdXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sQ0FBQyxPQUFPLEdBQUc7SUFDZixJQUFJLEVBQUUsTUFBTTtJQUNaLFFBQVEsRUFBRSxlQUFlO0lBQ3pCLFdBQVcsRUFBRSxpQkFBaUI7SUFDOUIsV0FBVyxFQUFFLENBQUMsaUJBQWlCLENBQUM7SUFDaEMsVUFBVSxFQUFFO1FBQ1Y7WUFDRSxJQUFJLEVBQUUsUUFBUTtZQUNkLElBQUksRUFBRSxNQUFNO1lBQ1osUUFBUSxFQUFFLElBQUk7U0FDZjtRQUNEO1lBQ0UsSUFBSSxFQUFFLE1BQU07WUFDWixJQUFJLEVBQUUsTUFBTTtTQUNiO1FBQ0Q7WUFDRSxJQUFJLEVBQUUsUUFBUTtZQUNkLElBQUksRUFBRSxNQUFNO1NBQ2I7S0FDRjtJQUNELEtBQUssQ0FBQyxPQUFPLENBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJO1FBQ2xDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUU7WUFBRSxPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUseUJBQXlCLENBQUMsQ0FBQztRQUUxSCxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUVoRCxNQUFNLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFFN0MsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRTthQUNuRCxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7YUFDbEMsU0FBUyxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLGtCQUFrQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7YUFDckgsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDO2FBQ3pFLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO2FBQ3BCLFlBQVksRUFBRSxDQUFDLENBQUM7UUFFbkIsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDWCxVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNkLE1BQU0sQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQztnQkFDeEMsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFO3FCQUMxRCxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7cUJBQ2xDLFNBQVMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxtQkFBbUIsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztxQkFDdkUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7cUJBQ3BCLFlBQVksRUFBRSxDQUFDLENBQUM7WUFDckIsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztTQUNwQztJQUNILENBQUM7Q0FDRixDQUFDIn0=