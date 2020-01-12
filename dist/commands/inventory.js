module.exports = {
    name: 'inventory',
    description: 'Shows a members inventory',
    parameters: [
        {
            name: 'member',
            type: String
        }
    ],
    async execute(client, message, args) {
        const user = message.mentions.users.first() || message.author;
        const member = message.guild.member(user);
        const memberData = await client.model.members.findByPk(user.id);
        const inventoryEmbed = new client.discord.MessageEmbed()
            .setColor(client.config.embedColor)
            .setTitle(`Inventory of ${member.displayName}`);
        Object.entries(memberData.inventory).map(([key, value]) => {
            inventoryEmbed.addField(key, value);
        });
        return message.channel.send(inventoryEmbed);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW52ZW50b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL2ludmVudG9yeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLENBQUMsT0FBTyxHQUFHO0lBQ2YsSUFBSSxFQUFFLFdBQVc7SUFDakIsV0FBVyxFQUFFLDJCQUEyQjtJQUN4QyxVQUFVLEVBQUU7UUFDVjtZQUNFLElBQUksRUFBRSxRQUFRO1lBQ2QsSUFBSSxFQUFFLE1BQU07U0FDYjtLQUNGO0lBQ0QsS0FBSyxDQUFDLE9BQU8sQ0FBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUk7UUFDbEMsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUM5RCxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxQyxNQUFNLFVBQVUsR0FBRyxNQUFNLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUVyRixNQUFNLGNBQWMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFO2FBQ3JELFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQzthQUNsQyxRQUFRLENBQUMsZ0JBQWdCLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1FBRWxELE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUU7WUFDeEQsY0FBYyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdEMsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7Q0FDRixDQUFDIn0=