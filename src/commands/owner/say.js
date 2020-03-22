module.exports = {
  description: 'Says a string of text.',
  aliases: ['repeat'],
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