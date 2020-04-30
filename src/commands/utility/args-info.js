module.exports = {
  description: 'Information about the arguments provided.',
  parameters: [
    {
      name: 'arguments',
      type: String
    }
  ],
  async execute (client, message, args) {
    return message.channel.send(`Arguments: ${args.join(', ')}\nArguments length: ${args.length}`);
  }
};