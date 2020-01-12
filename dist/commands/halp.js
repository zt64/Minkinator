module.exports = {
    name: 'help',
    description: 'Displays information about a specific command.',
    aliases: ['commands', 'father-i-need-help'],
    parameters: [
        {
            name: 'command name',
            type: String
        }
    ],
    async execute(client, message, args) {
        const prefix = (await client.model.variables.findByPk('prefix')).value;
        const helpEmbed = new client.discord.MessageEmbed()
            .setColor(client.config.embedColor)
            .setTitle('Home page')
            .setDescription('There is a total of 3 command categories ')
            .setFooter('Page 1 of 1');
        const helpMessage = await message.channel.send(helpEmbed);
        helpMessage.react('🛠️');
        helpMessage.react('🥳');
        helpMessage.react('🕴️');
        helpMessage.react('❌');
        const filter = (reaction, user) => user.id === message.author.id && (reaction.emoji.name === '🏠' ||
            reaction.emoji.name === '🛠️' ||
            reaction.emoji.name === '🥳' ||
            reaction.emoji.name === '🕴️' ||
            reaction.emoji.name === '❌');
        const collector = helpMessage.createReactionCollector(filter);
        collector.on('collect', async (reaction) => {
            const emoji = reaction.emoji.name;
            switch (emoji) {
                case '🏠':
                    helpEmbed.setTitle('Home page');
                    helpEmbed.setDescription('There is a total of 3 command categories ');
                    helpEmbed.fields = [];
                    helpMessage.reactions.removeAll();
                    helpMessage.react('🛠️');
                    helpMessage.react('🥳');
                    helpMessage.react('🕴️');
                    helpMessage.react('❌');
                    break;
                case '🛠️':
                    helpEmbed.setTitle('Utility commands');
                    helpEmbed.setDescription(`For more information on a certain command you can type \`${prefix}help <command name>\``);
                    client.commands.map((command, index) => {
                        if (command.category !== 'Utility')
                            return;
                        helpEmbed.addField(`\`\`${prefix}${command.name}\`\``, command.description);
                    });
                    helpMessage.reactions.removeAll();
                    helpMessage.react('🏠');
                    helpMessage.react('❌');
                    break;
                case '🥳':
                    helpEmbed.setTitle('Fun commands');
                    helpEmbed.setDescription(`You can send \`${prefix}help <command name>\` to get info on a specific command.`);
                    client.commands.map((command, index) => {
                        if (command.category !== 'Fun')
                            return;
                        helpEmbed.addField(`\`\`${prefix}${command.name}\`\``, command.description);
                    });
                    helpMessage.reactions.removeAll();
                    helpMessage.react('🏠');
                    helpMessage.react('❌');
                    break;
                case '🕴️':
                    helpEmbed.setTitle('Administrator commands');
                    helpEmbed.setDescription(`You can send \`${prefix}help <command name>\` to get info on a specific command.`);
                    client.commands.map((command, index) => {
                        if (command.category !== 'Administrator')
                            return;
                        helpEmbed.addField(`\`\`${prefix}${command.name}\`\``, command.description);
                    });
                    helpMessage.reactions.removeAll();
                    helpMessage.react('🏠');
                    helpMessage.react('❌');
                    break;
                case '❌':
                    helpMessage.delete();
                    break;
            }
            await helpMessage.edit(helpEmbed);
        });
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFscC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9oYWxwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sQ0FBQyxPQUFPLEdBQUc7SUFDZixJQUFJLEVBQUUsTUFBTTtJQUNaLFdBQVcsRUFBRSxnREFBZ0Q7SUFDN0QsT0FBTyxFQUFFLENBQUMsVUFBVSxFQUFFLG9CQUFvQixDQUFDO0lBQzNDLFVBQVUsRUFBRTtRQUNWO1lBQ0UsSUFBSSxFQUFFLGNBQWM7WUFDcEIsSUFBSSxFQUFFLE1BQU07U0FDYjtLQUNGO0lBQ0QsS0FBSyxDQUFDLE9BQU8sQ0FBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUk7UUFDbEMsTUFBTSxNQUFNLEdBQUcsQ0FBQyxNQUFNLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBRTVGLE1BQU0sU0FBUyxHQUFHLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUU7YUFDaEQsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO2FBQ2xDLFFBQVEsQ0FBQyxXQUFXLENBQUM7YUFDckIsY0FBYyxDQUFDLDJDQUEyQyxDQUFDO2FBQzNELFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUU1QixNQUFNLFdBQVcsR0FBRyxNQUFNLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRTFELFdBQVcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekIsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4QixXQUFXLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pCLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7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