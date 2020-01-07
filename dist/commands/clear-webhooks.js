module.exports = {
    name: 'clear-webhooks',
    description: 'Deletes all of a guilds web hooks.',
    permissions: ['MANAGE_WEBHOOKS'],
    aliases: ['delete-webhooks', 'del-webhooks', 'dwh'],
    async execute(client, message, args) {
        const webhooks = await message.guild.fetchWebhooks();
        webhooks.map(async (webhook) => {
            (await client.fetchWebhook(webhook.id)).delete();
        });
        return message.channel.send(`Deleted ${webhooks.size} webhooks from the guild.`);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xlYXItd2ViaG9va3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvY2xlYXItd2ViaG9va3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxDQUFDLE9BQU8sR0FBRztJQUNmLElBQUksRUFBRSxnQkFBZ0I7SUFDdEIsV0FBVyxFQUFFLG9DQUFvQztJQUNqRCxXQUFXLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztJQUNoQyxPQUFPLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxjQUFjLEVBQUUsS0FBSyxDQUFDO0lBQ25ELEtBQUssQ0FBQyxPQUFPLENBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJO1FBQ2xDLE1BQU0sUUFBUSxHQUFHLE1BQU0sT0FBTyxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUVyRCxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBQyxPQUFPLEVBQUMsRUFBRTtZQUMzQixDQUFDLE1BQU0sTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNuRCxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxRQUFRLENBQUMsSUFBSSwyQkFBMkIsQ0FBQyxDQUFDO0lBQ25GLENBQUM7Q0FDRixDQUFDIn0=