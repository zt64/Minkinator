module.exports = {
  description: 'Sends a message using a swarm.',
  permissions: ['MANAGED_WEBHOOKS'],
  parameters: [
    {
      name: 'amount',
      type: Number,
      required: true
    },
    {
      name: 'message',
      type: String,
      required: true
    }
  ],
  async execute (client, message, args) {
    const webHooks = {};

    if (isNaN(args[0]) || args[0] < 1 || args[0] > 10) return message.channel.send('Enter a number between 1 and 10');

    // Create web hooks

    for (let i = 0; i < args[0]; i++) {
      webHooks[i] = await message.channel.createWebhook(`Minker ${i + 1}`, {
        avatar: client.user.avatarURL()
      });
    }

    // Send message

    for (let i = 0; i < args[0]; i++) {
      await webHooks[i].send(args.slice(1).join(' '));
    }

    // Delete web hooks

    for (let i = 0; i < args[0]; i++) {
      webHooks[i].delete();
    }
  }
};