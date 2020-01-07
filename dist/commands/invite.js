module.exports = {
    name: 'invite',
    category: 'Utility',
    description: 'Generates an invitation link for Minkinator',
    async execute(client, message, args) {
        const inviteURL = await client.generateInvite(['ADMINISTRATOR']);
        return message.channel.send(new client.discord.MessageEmbed()
            .setColor(client.config.embedColor)
            .setTitle('Invite Minkinator to any server')
            .setDescription(`Click on the title URL and you can add Minkinator to other servers. This does require administrator rights in the server to be added. \n\n ${inviteURL}`)
            .setURL(inviteURL)
            .setTimestamp());
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW52aXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL2ludml0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLENBQUMsT0FBTyxHQUFHO0lBQ2YsSUFBSSxFQUFFLFFBQVE7SUFDZCxRQUFRLEVBQUUsU0FBUztJQUNuQixXQUFXLEVBQUUsNkNBQTZDO0lBQzFELEtBQUssQ0FBQyxPQUFPLENBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJO1FBQ2xDLE1BQU0sU0FBUyxHQUFHLE1BQU0sTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7UUFFakUsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFO2FBQzFELFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQzthQUNsQyxRQUFRLENBQUMsaUNBQWlDLENBQUM7YUFDM0MsY0FBYyxDQUFDLDhJQUE4SSxTQUFTLEVBQUUsQ0FBQzthQUN6SyxNQUFNLENBQUMsU0FBUyxDQUFDO2FBQ2pCLFlBQVksRUFBRSxDQUNoQixDQUFDO0lBQ0osQ0FBQztDQUNGLENBQUMifQ==