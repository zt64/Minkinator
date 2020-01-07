module.exports = {
    name: 'say',
    description: 'Says a string of text.',
    aliases: ['repeat'],
    parameters: [
        {
            name: 'string',
            type: String,
            required: true
        }
    ],
    async execute(client, message) {
        await message.delete();
        return message.channel.send(message.content.slice(5));
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2F5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL3NheS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLENBQUMsT0FBTyxHQUFHO0lBQ2YsSUFBSSxFQUFFLEtBQUs7SUFDWCxXQUFXLEVBQUUsd0JBQXdCO0lBQ3JDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQztJQUNuQixVQUFVLEVBQUU7UUFDVjtZQUNFLElBQUksRUFBRSxRQUFRO1lBQ2QsSUFBSSxFQUFFLE1BQU07WUFDWixRQUFRLEVBQUUsSUFBSTtTQUNmO0tBQ0Y7SUFDRCxLQUFLLENBQUMsT0FBTyxDQUFFLE1BQU0sRUFBRSxPQUFPO1FBQzVCLE1BQU0sT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRXZCLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDO0NBQ0YsQ0FBQyJ9