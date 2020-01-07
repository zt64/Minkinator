module.exports = {
    name: 'unban',
    category: 'Administrator',
    description: 'Revokes a members ban.',
    permissions: ['BAN_MEMBERS'],
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
    async execute(client, message, args) {
        if (!message.mentions.members.first())
            return message.reply(`${message.mentions.members.first()} is not a valid member.`);
        const member = message.mentions.members.first();
        message.guild.unban(member.user);
        return message.channel.send(new client.discord.MessageEmbed()
            .setColor(client.config.embedColor)
            .setAuthor(`${member.user.tag} has been unbanned`, member.user.avatarURL)
            .setFooter(member.id)
            .setTimestamp());
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5iYW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvdW5iYW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxDQUFDLE9BQU8sR0FBRztJQUNmLElBQUksRUFBRSxPQUFPO0lBQ2IsUUFBUSxFQUFFLGVBQWU7SUFDekIsV0FBVyxFQUFFLHdCQUF3QjtJQUNyQyxXQUFXLEVBQUUsQ0FBQyxhQUFhLENBQUM7SUFDNUIsVUFBVSxFQUFFO1FBQ1Y7WUFDRSxJQUFJLEVBQUUsUUFBUTtZQUNkLElBQUksRUFBRSxNQUFNO1lBQ1osUUFBUSxFQUFFLElBQUk7U0FDZjtRQUNEO1lBQ0UsSUFBSSxFQUFFLFFBQVE7WUFDZCxJQUFJLEVBQUUsTUFBTTtTQUNiO0tBQ0Y7SUFDRCxLQUFLLENBQUMsT0FBTyxDQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSTtRQUNsQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFO1lBQUUsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLHlCQUF5QixDQUFDLENBQUM7UUFDMUgsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFaEQsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWpDLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRTthQUMxRCxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7YUFDbEMsU0FBUyxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLG9CQUFvQixFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO2FBQ3hFLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO2FBQ3BCLFlBQVksRUFBRSxDQUFDLENBQUM7SUFDckIsQ0FBQztDQUNGLENBQUMifQ==