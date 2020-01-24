module.exports = {
  name: 'swarm',
  description: 'Sends a message using a swarm.',
  permissions: ['MANAGE_WEBHOOKS'],
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
    const webhooks = {};

    if (isNaN(args[0]) || args[0] < 1 || args[0] > 10) return message.channel.send('Enter a number between 1 and 10');

    for (let i = 0; i < args[0]; i++) {
      webhooks[i] = await message.channel.createWebhook(`Minker ${i + 1}`, {
        avatar: client.user.avatarURL()
      });
    }

    for (let i = 0; i < args[0]; i++) {
      await webhooks[i].send(args.slice(1).join(' '));
    }

    for (let i = 0; i < args[0]; i++) {
      webhooks[i].delete();
    }
  }
};