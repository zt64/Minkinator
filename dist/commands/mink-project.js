module.exports = {
    name: 'mink-project',
    description: 'Information about the mink project.',
    aliases: ['mp'],
    async execute(client, message) {
        const balance = await client.model.variables.findByPk('minkProject');
        return message.channel.send(`The mink project currenctly stands at a balance of ${client.config.currency}${balance.value}.`);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWluay1wcm9qZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL21pbmstcHJvamVjdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLENBQUMsT0FBTyxHQUFHO0lBQ2YsSUFBSSxFQUFFLGNBQWM7SUFDcEIsV0FBVyxFQUFFLHFDQUFxQztJQUNsRCxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUM7SUFDZixLQUFLLENBQUMsT0FBTyxDQUFFLE1BQU0sRUFBRSxPQUFPO1FBQzVCLE1BQU0sT0FBTyxHQUFHLE1BQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFMUYsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxzREFBc0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDL0gsQ0FBQztDQUNGLENBQUMifQ==