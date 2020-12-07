module.exports = {
  description: "Repeat a command.",
  parameters: [
    {
      name: "amount",
      type: Number,
      required: true
    },
    {
      name: "command",
      type: String,
      required: true
    }
  ],
  async execute (client, message, args) {
    const [ amount, commandName ] = args;

    const command = client.commands.get(commandName);

    if (!command) return message.channel.send(`Unable to find \`${commandName}\`.`);

    // Send command
    for (var i = 0; i < amount; i++) {
      await command.execute(client, message, args.slice(2));

      await util.sleep(1000);
    }
  }
};