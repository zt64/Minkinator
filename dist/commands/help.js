module.exports = {
    name: 'help',
    description: 'Displays information about a specific command.',
    aliases: ['commands', 'father-i-need-help'],
    usage: '<command name>',
    async execute(client, message, args) {
        const prefix = (await client.model.variables.findByPk('prefix')).value;
        const embed = new client.discord.MessageEmbed()
            .setColor(client.config.embedColor);
        if (!args.length) {
            embed.setTitle('You have summoned I, the Minkinator. What shall I do today?');
            embed.setDescription(`You can send \`${prefix}help <command name>\` to get info on a specific command.`);
            embed.setAuthor('List of commands', client.user.avatarURL());
            embed.addField('**Commands**', `${client.commands.map(command => {
                if (command.permissions && !message.member.hasPermission(command.permissions))
                    return;
                return command.name;
            }).filter(Boolean).join(', ')}`);
            embed.setFooter('Created by Litleck');
            embed.setTimestamp();
            return message.channel.send(embed);
        }
        const name = args[0].toLowerCase();
        const command = client.commands.get(name) || client.commands.find(c => c.aliases && c.aliases.includes(name));
        if (!command || (command.permissions && !message.member.hasPermission(command.permissions))) {
            return message.channel.send(new client.discord.MessageEmbed()
                .setColor(client.config.embedColor)
                .setTitle('Invalid Command')
                .setDescription(`\`\`${name}\`\` is not a valid command.`));
        }
        embed.addField('**Command**:', command.name, true);
        if (command.aliases)
            embed.addField('**Aliases**:', command.aliases.join(', '), true);
        if (command.description)
            embed.addField('**Description**:', command.description, true);
        if (command.usage)
            embed.addField('**Usage**:', command.usage, true);
        embed.addField('**Cool down**:', `${command.coolDown || 3} second(s)`, true);
        embed.addField('**Permissions**:', command.permissions ? command.permissions.join(', ') : 'Everyone', true);
        embed.setFooter('Created by Litleck');
        embed.setTimestamp();
        return message.channel.send(embed);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9oZWxwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sQ0FBQyxPQUFPLEdBQUc7SUFDZixJQUFJLEVBQUUsTUFBTTtJQUNaLFdBQVcsRUFBRSxnREFBZ0Q7SUFDN0QsT0FBTyxFQUFFLENBQUMsVUFBVSxFQUFFLG9CQUFvQixDQUFDO0lBQzNDLEtBQUssRUFBRSxnQkFBZ0I7SUFDdkIsS0FBSyxDQUFDLE9BQU8sQ0FBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUk7UUFDbEMsTUFBTSxNQUFNLEdBQUcsQ0FBQyxNQUFNLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQzVGLE1BQU0sS0FBSyxHQUFHLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUU7YUFDNUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFdEMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDaEIsS0FBSyxDQUFDLFFBQVEsQ0FBQyw2REFBNkQsQ0FBQyxDQUFDO1lBQzlFLEtBQUssQ0FBQyxjQUFjLENBQUMsa0JBQWtCLE1BQU0sMERBQTBELENBQUMsQ0FBQztZQUN6RyxLQUFLLENBQUMsU0FBUyxDQUFDLGtCQUFrQixFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztZQUM3RCxLQUFLLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUM1RCxJQUFJLE9BQU8sQ0FBQyxXQUFXLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FB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