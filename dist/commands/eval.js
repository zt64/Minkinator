/* eslint-disable no-eval */
module.exports = {
    name: 'eval',
    description: 'Evaluates Javascript code.',
    aliases: ['evaluate'],
    botOwner: true,
    parameters: [
        {
            name: 'input',
            type: String,
            required: true
        }
    ],
    async execute(client, message, args) {
        try {
            return message.channel.send(new client.discord.MessageEmbed()
                .setColor(client.config.embedColor)
                .setTitle('JS Result')
                .setDescription(`\`\`\`js\n${await eval(`(async()=>{${args.join(' ')}})()`)}\n\`\`\``));
        }
        catch (e) {
            return message.channel.send(new client.discord.MessageEmbed()
                .setColor(client.config.embedError)
                .setTitle('JS Error')
                .setDescription(`\`\`\`js\n${e}\n\`\`\``));
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9ldmFsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDRCQUE0QjtBQUM1QixNQUFNLENBQUMsT0FBTyxHQUFHO0lBQ2YsSUFBSSxFQUFFLE1BQU07SUFDWixXQUFXLEVBQUUsNEJBQTRCO0lBQ3pDLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQztJQUNyQixRQUFRLEVBQUUsSUFBSTtJQUNkLFVBQVUsRUFBRTtRQUNWO1lBQ0UsSUFBSSxFQUFFLE9BQU87WUFDYixJQUFJLEVBQUUsTUFBTTtZQUNaLFFBQVEsRUFBRSxJQUFJO1NBQ2Y7S0FDRjtJQUNELEtBQUssQ0FBQyxPQUFPLENBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJO1FBQ2xDLElBQUk7WUFDRixPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUU7aUJBQzFELFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztpQkFDbEMsUUFBUSxDQUFDLFdBQVcsQ0FBQztpQkFDckIsY0FBYyxDQUFDLGFBQWEsTUFBTSxJQUFJLENBQUMsY0FBYyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQ3ZGLENBQUM7U0FDSDtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFO2lCQUMxRCxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7aUJBQ2xDLFFBQVEsQ0FBQyxVQUFVLENBQUM7aUJBQ3BCLGNBQWMsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQzFDLENBQUM7U0FDSDtJQUNILENBQUM7Q0FDRixDQUFDIn0=