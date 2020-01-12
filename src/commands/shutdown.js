module.exports = {
  name: 'shutdown',
  category: 'Administrator',
  description: 'Shutdowns the bot.',
  botOwner: true,
  parameters: [
    {
      name: 'seconds',
      type: Number
    }
  ],
  aliases: ['stop', 'exit', 'quit'],
  async execute (client, message, args) {
    if (!isNaN(args[0])) {
      message.channel.send(`Shutting down in ${args[0]} seconds.`);
      await setTimeout(() => {
        shutdown();
      }, args[0] * 1000);
    } else {
      shutdown();
    }

    async function shutdown () {
      await console.log('Shutting down.');
      await message.channel.send('Shutting down.');

      client.destroy();
    }
  }
};