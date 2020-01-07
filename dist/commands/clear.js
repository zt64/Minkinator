module.exports = {
    name: 'clear',
    category: 'Administrator',
    description: 'Removes a set amount of messages.',
    aliases: ['purge', 'sweep'],
    permissions: ['MANAGE_MESSAGES'],
    parameters: [
        {
            name: 'messages',
            type: Number,
            required: true
        }
    ],
    async execute(client, message, args) {
        if (isNaN(args[0]) || args[0] < 1)
            return message.channel.send('Please enter a valid number between 1 and 100');
        return message.channel.bulkDelete(Math.round(args[0]));
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xlYXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvY2xlYXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxDQUFDLE9BQU8sR0FBRztJQUNmLElBQUksRUFBRSxPQUFPO0lBQ2IsUUFBUSxFQUFFLGVBQWU7SUFDekIsV0FBVyxFQUFFLG1DQUFtQztJQUNoRCxPQUFPLEVBQUUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDO0lBQzNCLFdBQVcsRUFBRSxDQUFDLGlCQUFpQixDQUFDO0lBQ2hDLFVBQVUsRUFBRTtRQUNWO1lBQ0UsSUFBSSxFQUFFLFVBQVU7WUFDaEIsSUFBSSxFQUFFLE1BQU07WUFDWixRQUFRLEVBQUUsSUFBSTtTQUNmO0tBQ0Y7SUFDRCxLQUFLLENBQUMsT0FBTyxDQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSTtRQUNsQyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztZQUFFLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsK0NBQStDLENBQUMsQ0FBQztRQUVoSCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6RCxDQUFDO0NBQ0YsQ0FBQyJ9