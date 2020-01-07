module.exports = {
  name: 'clear-webhooks',
  description: 'Deletes all of a guilds web hooks.',
  permissions: ['MANAGE_WEBHOOKS'],
  aliases: ['delete-webhooks', 'del-webhooks', 'dwh'],
  async execute (client, message, args) {
    const webhooks = await message.guild.fetchWebhooks();

    webhooks.map(async webhook => {
      (await client.fetchWebhook(webhook.id)).delete();
    });

    return message.channel.send(`Deleted ${webhooks.size} webhooks from the guild.`);
  }
};