module.exports = {
    name: 'bot-info',
    description: 'Returns bot information and ',
    async execute(client, message, args) {
        return message.channel.send(new client.discord.MessageEmbed()
            .setColor(client.config.embedColor)
            .setTitle('Minkinator Information')
            .setDescription('Minkinator is a one of the kind ~~nightmare~~ friend that will help you along your journeys. He is the digitalized form of the rat god, Minky. Allow Minkinator to ~~take control of your life~~ help you out whenever the time comes.')
            .addField('Commands:', client.commands.size, true)
            .addField('Events:', client.events.size, true)
            .addField('Uptime (HH:mm:ss):', client.moment.utc(client.uptime).format('HH:mm:ss'), true)
            .setFooter(`Created by Litleck (${(await client.users.fetch(client.config.botOwner)).tag})`));
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90LWluZm8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvYm90LWluZm8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxDQUFDLE9BQU8sR0FBRztJQUNmLElBQUksRUFBRSxVQUFVO0lBQ2hCLFdBQVcsRUFBRSw4QkFBOEI7SUFDM0MsS0FBSyxDQUFDLE9BQU8sQ0FBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUk7UUFDbEMsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFO2FBQzFELFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQzthQUNsQyxRQUFRLENBQUMsd0JBQXdCLENBQUM7YUFDbEMsY0FBYyxDQUFDLHdPQUF3TyxDQUFDO2FBQ3hQLFFBQVEsQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2FBQ2pELFFBQVEsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2FBQzdDLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFLElBQUksQ0FBQzthQUN6RixTQUFTLENBQUMsdUJBQXVCLENBQUMsTUFBTSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FDN0YsQ0FBQztJQUNKLENBQUM7Q0FDRixDQUFDIn0=