module.exports = {
    name: 'reload',
    category: 'Administrator',
    description: 'Reloads the bot commands.',
    aliases: ['restart', 'reboot', 'r'],
    usage: '<command>',
    permissions: ['ADMINISTRATOR'],
    async execute(client, message, args) {
        const commands = client.commands;
        const events = client.events;
        const reloadEmbed = new client.discord.MessageEmbed()
            .setColor(client.config.embedColor)
            .setTitle('Reloading')
            .setDescription(`Reloading ${commands.size} commands and ${events.size} events`)
            .setTimestamp();
        const reloadMessage = await message.channel.send(reloadEmbed);
        client.removeAllListeners();
        client.commands.clear();
        await client.loadEvents();
        await client.loadCommands();
        reloadEmbed.setTitle('Finished reloading');
        reloadEmbed.setDescription(`Reloaded ${commands.size} commands and ${events.size} events in ${reloadMessage.createdTimestamp - message.createdTimestamp}ms`);
        reloadMessage.edit(reloadEmbed);
        return console.log('Finished reloading commands and events');
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVsb2FkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL3JlbG9hZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLENBQUMsT0FBTyxHQUFHO0lBQ2YsSUFBSSxFQUFFLFFBQVE7SUFDZCxRQUFRLEVBQUUsZUFBZTtJQUN6QixXQUFXLEVBQUUsMkJBQTJCO0lBQ3hDLE9BQU8sRUFBRSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsR0FBRyxDQUFDO0lBQ25DLEtBQUssRUFBRSxXQUFXO0lBQ2xCLFdBQVcsRUFBRSxDQUFDLGVBQWUsQ0FBQztJQUM5QixLQUFLLENBQUMsT0FBTyxDQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSTtRQUNsQyxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ2pDLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFFN0IsTUFBTSxXQUFXLEdBQUcsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRTthQUNsRCxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7YUFDbEMsUUFBUSxDQUFDLFdBQVcsQ0FBQzthQUNyQixjQUFjLENBQUMsYUFBYSxRQUFRLENBQUMsSUFBSSxpQkFBaUIsTUFBTSxDQUFDLElBQUksU0FBUyxDQUFDO2FBQy9FLFlBQVksRUFBRSxDQUFDO1FBRWxCLE1BQU0sYUFBYSxHQUFHLE1BQU0sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFOUQsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDNUIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUV4QixNQUFNLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUMxQixNQUFNLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUU1QixXQUFXLENBQUMsUUFBUSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDM0MsV0FBVyxDQUFDLGNBQWMsQ0FBQyxZQUFZLFFBQVEsQ0FBQyxJQUFJLGlCQUFpQixNQUFNLENBQUMsSUFBSSxjQUFjLGFBQWEsQ0FBQyxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLElBQUksQ0FBQyxDQUFDO1FBRTdKLGFBQWEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDaEMsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7SUFDL0QsQ0FBQztDQUNGLENBQUMifQ==