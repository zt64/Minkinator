module.exports = {
    name: 'shutdown',
    category: 'Administrator',
    description: 'Shutdowns the bot.',
    parameters: [
        {
            name: 'seconds',
            type: Number
        }
    ],
    aliases: ['stop', 'exit', 'quit'],
    permissions: ['ADMINISTRATOR'],
    async execute(client, message, args) {
        if (!isNaN(args[0])) {
            message.channel.send(`Shutting down in ${args[0]} seconds.`);
            await setTimeout(() => {
                shutdown();
            }, args[0] * 1000);
        }
        else {
            shutdown();
        }
        async function shutdown() {
            await console.log('Shutting down.');
            await message.channel.send('Shutting down.');
            client.destroy();
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2h1dGRvd24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvc2h1dGRvd24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxDQUFDLE9BQU8sR0FBRztJQUNmLElBQUksRUFBRSxVQUFVO0lBQ2hCLFFBQVEsRUFBRSxlQUFlO0lBQ3pCLFdBQVcsRUFBRSxvQkFBb0I7SUFDakMsVUFBVSxFQUFFO1FBQ1Y7WUFDRSxJQUFJLEVBQUUsU0FBUztZQUNmLElBQUksRUFBRSxNQUFNO1NBQ2I7S0FDRjtJQUNELE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDO0lBQ2pDLFdBQVcsRUFBRSxDQUFDLGVBQWUsQ0FBQztJQUM5QixLQUFLLENBQUMsT0FBTyxDQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSTtRQUNsQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ25CLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLG9CQUFvQixJQUFJLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzdELE1BQU0sVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDcEIsUUFBUSxFQUFFLENBQUM7WUFDYixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1NBQ3BCO2FBQU07WUFDTCxRQUFRLEVBQUUsQ0FBQztTQUNaO1FBRUQsS0FBSyxVQUFVLFFBQVE7WUFDckIsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDcEMsTUFBTSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQzdDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNuQixDQUFDO0lBQ0gsQ0FBQztDQUNGLENBQUMifQ==