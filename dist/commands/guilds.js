module.exports = {
    name: 'guilds',
    description: 'Shows the current guilds and members Minkinator is watching.',
    aliases: ['servers'],
    async execute(client, message, args) {
        const guilds = client.guilds;
        const guildsEmbed = new client.discord.MessageEmbed()
            .setColor(client.config.embedColor)
            .setTitle(`Watching ${guilds.size} guilds and ${client.users.size} members`);
        guilds.map(guild => {
            guildsEmbed.addField(`${guild.name}`, `Members: ${guild.members.size} \n ID: ${guild.id}`);
        });
        return message.channel.send(guildsEmbed);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpbGRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL2d1aWxkcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLENBQUMsT0FBTyxHQUFHO0lBQ2YsSUFBSSxFQUFFLFFBQVE7SUFDZCxXQUFXLEVBQUUsOERBQThEO0lBQzNFLE9BQU8sRUFBRSxDQUFDLFNBQVMsQ0FBQztJQUNwQixLQUFLLENBQUMsT0FBTyxDQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSTtRQUNsQyxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBRTdCLE1BQU0sV0FBVyxHQUFHLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUU7YUFDbEQsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO2FBQ2xDLFFBQVEsQ0FBQyxZQUFZLE1BQU0sQ0FBQyxJQUFJLGVBQWUsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLFVBQVUsQ0FBQyxDQUFDO1FBRS9FLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDakIsV0FBVyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLEVBQUUsRUFBRSxZQUFZLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxXQUFXLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzdGLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUMzQyxDQUFDO0NBQ0YsQ0FBQyJ9