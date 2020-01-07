module.exports = {
    name: 'kick',
    category: 'Administrator',
    description: 'Kicks a member.',
    usage: '[member] <reason>',
    permissions: ['KICK_MEMBERS'],
    parameters: [
        {
            name: 'member',
            type: String,
            required: true
        },
        {
            name: 'reason',
            type: String
        }
    ],
    execute(client, message, args) {
        const member = message.mentions.members.first();
        const reason = args.slice(1).join(' ');
        if (!member)
            return message.reply(`${message.mentions.members.first()} is not a valid member.`);
        message.guild.member(member).kick();
        return message.channel.send(new client.discord.MessageEmbed()
            .setColor(client.config.embedColor)
            .setTitle(`${member.user.tag} has been kicked`)
            .setDescription(args[2] ? reason : 'No reason provided.')
            .setTimestamp());
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2ljay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9raWNrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sQ0FBQyxPQUFPLEdBQUc7SUFDZixJQUFJLEVBQUUsTUFBTTtJQUNaLFFBQVEsRUFBRSxlQUFlO0lBQ3pCLFdBQVcsRUFBRSxpQkFBaUI7SUFDOUIsS0FBSyxFQUFFLG1CQUFtQjtJQUMxQixXQUFXLEVBQUUsQ0FBQyxjQUFjLENBQUM7SUFDN0IsVUFBVSxFQUFFO1FBQ1Y7WUFDRSxJQUFJLEVBQUUsUUFBUTtZQUNkLElBQUksRUFBRSxNQUFNO1lBQ1osUUFBUSxFQUFFLElBQUk7U0FDZjtRQUNEO1lBQ0UsSUFBSSxFQUFFLFFBQVE7WUFDZCxJQUFJLEVBQUUsTUFBTTtTQUNiO0tBQ0Y7SUFDRCxPQUFPLENBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJO1FBQzVCLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2hELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXZDLElBQUksQ0FBQyxNQUFNO1lBQUUsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLHlCQUF5QixDQUFDLENBQUM7UUFFaEcsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFcEMsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFO2FBQzFELFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQzthQUNsQyxRQUFRLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsa0JBQWtCLENBQUM7YUFDOUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQzthQUN4RCxZQUFZLEVBQUUsQ0FBQyxDQUFDO0lBQ3JCLENBQUM7Q0FDRixDQUFDIn0=