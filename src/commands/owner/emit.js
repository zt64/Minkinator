module.exports = {
  description: "Runs emit on the client EventEmitter.",
  parameters: [
    {
      name: "event",
      type: String,
      required: true
    },
    {
      name: "parameters",
      type: String
    }
  ],
  async execute (client, message, args) {
    const [ event ] = args;
    const parameters = args.slice(2).join();

    // Emit event
    try {
      client.emit(event, parameters);

      return message.channel.send(`Successfully emitted \`${event}\`.`);
    } catch (error) {
      return message.channel.send(`Failed to emit \`${event}\`.`);
    }
  }
};
