module.exports = {
    name: 'set',
    category: 'Administrator',
    description: 'Manipulate guild database properties.',
    permissions: ['ADMINISTRATOR'],
    parameters: [
        {
            name: 'model',
            type: String,
            required: true
        },
        {
            name: 'object',
            type: String,
            required: true
        },
        {
            name: 'property',
            type: String,
            required: true
        },
        {
            name: 'value',
            type: String
        }
    ],
    async execute(client, message, args) {
        try {
            var model = client.model.sequelize.model(args[0]);
        }
        catch (e) {
            return message.channel.send(`Model: ${args[0]}, does not exist.`);
        }
        try {
            var object = await model.findByPk(args[1]);
        }
        catch (e) {
            return message.channel.send(`Object: ${args[1]}, does not exist.`);
        }
        try {
            await object.update({ [args[2]]: JSON.parse(args.slice(3).join(' ')) });
            return message.channel.send(`Set ${args[0]}.${args[1]}.${args[2]} to \`${args.slice(3).join(' ')}\`.`);
        }
        catch (e) {
            return message.channel.send(`Property: ${args[2]}, does not exist.`);
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL3NldC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLENBQUMsT0FBTyxHQUFHO0lBQ2YsSUFBSSxFQUFFLEtBQUs7SUFDWCxRQUFRLEVBQUUsZUFBZTtJQUN6QixXQUFXLEVBQUUsdUNBQXVDO0lBQ3BELFdBQVcsRUFBRSxDQUFDLGVBQWUsQ0FBQztJQUM5QixVQUFVLEVBQUU7UUFDVjtZQUNFLElBQUksRUFBRSxPQUFPO1lBQ2IsSUFBSSxFQUFFLE1BQU07WUFDWixRQUFRLEVBQUUsSUFBSTtTQUNmO1FBQ0Q7WUFDRSxJQUFJLEVBQUUsUUFBUTtZQUNkLElBQUksRUFBRSxNQUFNO1lBQ1osUUFBUSxFQUFFLElBQUk7U0FDZjtRQUNEO1lBQ0UsSUFBSSxFQUFFLFVBQVU7WUFDaEIsSUFBSSxFQUFFLE1BQU07WUFDWixRQUFRLEVBQUUsSUFBSTtTQUNmO1FBQ0Q7WUFDRSxJQUFJLEVBQUUsT0FBTztZQUNiLElBQUksRUFBRSxNQUFNO1NBQ2I7S0FDRjtJQUNELEtBQUssQ0FBQyxPQUFPLENBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJO1FBQ2xDLElBQUk7WUFDRixJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN4RTtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQztTQUNuRTtRQUVELElBQUk7WUFDRixJQUFJLE1BQU0sR0FBRyxNQUFNLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDNUM7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUM7U0FDcEU7UUFFRCxJQUFJO1lBQ0YsTUFBTSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3hFLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDeEc7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUM7U0FDdEU7SUFDSCxDQUFDO0NBQ0YsQ0FBQyJ9