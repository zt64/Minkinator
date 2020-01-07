module.exports = {
    name: 'exec',
    description: 'Executes in terminal.',
    botOwner: true,
    parameters: [
        {
            name: 'input',
            type: String,
            required: true
        }
    ],
    async execute(client, message, args) {
        const execSync = require('child_process').execSync;
        try {
            return message.channel.send(new client.discord.MessageEmbed()
                .setColor(client.config.embedColor)
                .setTitle('Execution Result')
                .setDescription(`\`\`\`bash\n${execSync(args.join(' '), { encoding: 'utf-8' })}\n\`\`\``));
        }
        catch (e) {
            return message.channel.send(new client.discord.MessageEmbed()
                .setColor(client.config.embedError)
                .setTitle('Execution Error')
                .setDescription(`\`\`\`bash\n${e}\n\`\`\``));
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9leGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sQ0FBQyxPQUFPLEdBQUc7SUFDZixJQUFJLEVBQUUsTUFBTTtJQUNaLFdBQVcsRUFBRSx1QkFBdUI7SUFDcEMsUUFBUSxFQUFFLElBQUk7SUFDZCxVQUFVLEVBQUU7UUFDVjtZQUNFLElBQUksRUFBRSxPQUFPO1lBQ2IsSUFBSSxFQUFFLE1BQU07WUFDWixRQUFRLEVBQUUsSUFBSTtTQUNmO0tBQ0Y7SUFDRCxLQUFLLENBQUMsT0FBTyxDQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSTtRQUNsQyxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsUUFBUSxDQUFDO1FBRW5ELElBQUk7WUFDRixPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUU7aUJBQzFELFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztpQkFDbEMsUUFBUSxDQUFDLGtCQUFrQixDQUFDO2lCQUM1QixjQUFjLENBQUMsZUFBZSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FDMUYsQ0FBQztTQUNIO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDVixPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUU7aUJBQzFELFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztpQkFDbEMsUUFBUSxDQUFDLGlCQUFpQixDQUFDO2lCQUMzQixjQUFjLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUM1QyxDQUFDO1NBQ0g7SUFDSCxDQUFDO0NBQ0YsQ0FBQyJ9