module.exports = {
  description: 'Repeat a command.',
  parameters: [
    {
      name: 'amount',
      type: Number,
      required: true
    },
    {
      name: 'command',
      type: String,
      required: true
    }
  ],
  async execute (client, message, args) {
    const amount = args[0];
    const commandName = args[1];

    const command = client.commands.get(commandName);

    if (command) {
      for (var i = 0; i < amount; i++) {
        command.execute(client, message, args.slice(2));
      }
    }
  }
};