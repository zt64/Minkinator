module.exports = {
    name: 'args-info',
    description: 'Information about the arguments provided.',
    usage: '[arguments]',
    parameters: [
        {
            name: 'arguments',
            type: String
        }
    ],
    async execute(client, message, args) {
        return message.channel.send(`Arguments: ${args.join(', ')}\nArguments length: ${args.length}`);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJncy1pbmZvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL2FyZ3MtaW5mby5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLENBQUMsT0FBTyxHQUFHO0lBQ2YsSUFBSSxFQUFFLFdBQVc7SUFDakIsV0FBVyxFQUFFLDJDQUEyQztJQUN4RCxLQUFLLEVBQUUsYUFBYTtJQUNwQixVQUFVLEVBQUU7UUFDVjtZQUNFLElBQUksRUFBRSxXQUFXO1lBQ2pCLElBQUksRUFBRSxNQUFNO1NBQ2I7S0FDRjtJQUNELEtBQUssQ0FBQyxPQUFPLENBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJO1FBQ2xDLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDakcsQ0FBQztDQUNGLENBQUMifQ==