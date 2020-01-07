module.exports = {
    name: 'dm',
    description: 'DM a user with a message.',
    permissions: ['ADMINISTRATOR'],
    parameters: [
        {
            name: 'user',
            type: String
        },
        {
            name: 'message',
            type: String
        }
    ],
    async execute(client, message, args) {
        const user = message.mentions.users.first();
        const msg = args[1];
        user.send(msg);
        return message.channel.send(`Sent a DM to ${user}`);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvZG0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxDQUFDLE9BQU8sR0FBRztJQUNmLElBQUksRUFBRSxJQUFJO0lBQ1YsV0FBVyxFQUFFLDJCQUEyQjtJQUN4QyxXQUFXLEVBQUUsQ0FBQyxlQUFlLENBQUM7SUFDOUIsVUFBVSxFQUFFO1FBQ1Y7WUFDRSxJQUFJLEVBQUUsTUFBTTtZQUNaLElBQUksRUFBRSxNQUFNO1NBQ2I7UUFDRDtZQUNFLElBQUksRUFBRSxTQUFTO1lBQ2YsSUFBSSxFQUFFLE1BQU07U0FDYjtLQUNGO0lBQ0QsS0FBSyxDQUFDLE9BQU8sQ0FBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUk7UUFDbEMsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDNUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXBCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDZixPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3RELENBQUM7Q0FDRixDQUFDIn0=