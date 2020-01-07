module.exports = {
    name: 'unmute',
    category: 'Administrator',
    description: 'Revokes a members mute.',
    permissions: ['MANAGE_CHANNELS'],
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
        member.roles.remove('625385600081592321');
        return message.channel.send(new client.discord.MessageEmbed()
            .setColor(client.config.embedColor)
            .setAuthor(`${member.user.tag} has been unmuted`, member.user.avatarURL())
            .setFooter(member.id)
            .setTimestamp());
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5tdXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL3VubXV0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLENBQUMsT0FBTyxHQUFHO0lBQ2YsSUFBSSxFQUFFLFFBQVE7SUFDZCxRQUFRLEVBQUUsZUFBZTtJQUN6QixXQUFXLEVBQUUseUJBQXlCO0lBQ3RDLFdBQVcsRUFBRSxDQUFDLGlCQUFpQixDQUFDO0lBQ2hDLFVBQVUsRUFBRTtRQUNWO1lBQ0UsSUFBSSxFQUFFLFFBQVE7WUFDZCxJQUFJLEVBQUUsTUFBTTtZQUNaLFFBQVEsRUFBRSxJQUFJO1NBQ2Y7UUFDRDtZQUNFLElBQUksRUFBRSxRQUFRO1lBQ2QsSUFBSSxFQUFFLE1BQU07U0FDYjtLQUNGO0lBQ0QsS0FBSyxDQUFDLE9BQU8sQ0FBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUk7UUFDbEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRTtZQUFFLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO1FBQzFILE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRWhELE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFFMUMsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFO2FBQzFELFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQzthQUNsQyxTQUFTLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsbUJBQW1CLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQzthQUN6RSxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQzthQUNwQixZQUFZLEVBQUUsQ0FBQyxDQUFDO0lBQ3JCLENBQUM7Q0FDRixDQUFDIn0=