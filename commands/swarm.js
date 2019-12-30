module.exports = {
  name: 'swarm',
  description: 'Sends a message using a swarm.',
  usage: '[message]',
  args: true,
  async execute (client, message, args) {
    const minker = {};

    if (isNaN(args[0]) || args[0] < 1 || args[0] > 10) return message.channel.send('Enter a number between 1 and 10');

    for (let i = 0; i < args[0]; i++) {
      minker[i] = await message.channel.createWebhook(`Minker ${i + 1}`, {
        avatar: client.user.avatarURL()
      });
    }

    for (let i = 0; i < args[0]; i++) {
      await minker[i].send(args.slice(1).join(' '));
    }

    for (let i = 0; i < args[0]; i++) {
      minker[i].delete();
    }
  }
};