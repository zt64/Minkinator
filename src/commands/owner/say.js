module.exports = {
  description: 'Says a string of text.',
  parameters: [
    {
      name: 'string',
      type: String,
      required: true
    }
  ],
  async execute (client, message, args) {
    await message.delete();

    return message.channel.send(args.join(' '));
  }
};