module.exports = {
    name: 'list',
    description: 'Lists items available to buy.',
    async execute(client, message, args) {
        const items = await client.model.variables.findByPk('listings').value;
        const prefix = client.model.variables.findByPk('prefix').value;
        const listingEmbed = new client.discord.MessageEmbed()
            .setColor(client.config.embedColor)
            .setTitle('The Shop')
            .setDescription(`Buy items using \`\`${prefix}buy [item] <amount>\`\` \n Sell items using \`\`${prefix}sell [item] [amount] [price]\`\``);
        for (const [item, price] of items) {
            listingEmbed.addField(item, `${client.config.currency}${price}`);
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9saXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sQ0FBQyxPQUFPLEdBQUc7SUFDZixJQUFJLEVBQUUsTUFBTTtJQUNaLFdBQVcsRUFBRSwrQkFBK0I7SUFDNUMsS0FBSyxDQUFDLE9BQU8sQ0FBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUk7UUFDbEMsTUFBTSxLQUFLLEdBQUcsTUFBTSxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDM0YsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDO1FBRXBGLE1BQU0sWUFBWSxHQUFHLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUU7YUFDbkQsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO2FBQ2xDLFFBQVEsQ0FBQyxVQUFVLENBQUM7YUFDcEIsY0FBYyxDQUFDLHVCQUF1QixNQUFNLG1EQUFtRCxNQUFNLGtDQUFrQyxDQUFDLENBQUM7UUFFNUksS0FBSyxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLEtBQUssRUFBRTtZQUNqQyxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxHQUFHLEtBQUssRUFBRSxDQUFDLENBQUM7U0FDbEU7SUFDSCxDQUFDO0NBQ0YsQ0FBQyJ9