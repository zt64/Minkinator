module.exports = {
    name: 'reset-db',
    category: 'Administrator',
    description: 'Resets a guilds database',
    permissions: ['ADMINISTRATOR'],
    async execute(client, message, args) {
        await client.models[message.guild.name].drop();
        return message.channel.send('Successfully reset the database.');
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzZXQtZGIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvcmVzZXQtZGIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxDQUFDLE9BQU8sR0FBRztJQUNmLElBQUksRUFBRSxVQUFVO0lBQ2hCLFFBQVEsRUFBRSxlQUFlO0lBQ3pCLFdBQVcsRUFBRSwwQkFBMEI7SUFDdkMsV0FBVyxFQUFFLENBQUMsZUFBZSxDQUFDO0lBQzlCLEtBQUssQ0FBQyxPQUFPLENBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJO1FBQ2xDLE1BQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQy9DLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsa0NBQWtDLENBQUMsQ0FBQztJQUNsRSxDQUFDO0NBQ0YsQ0FBQyJ9