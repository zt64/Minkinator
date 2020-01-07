module.exports = {
  name: 'say',
  description: 'Says a string of text.',
  aliases: ['repeat'],
  parameters: [
    {
      name: 'string',
      type: String,
      required: true
    }
  ],
  async execute (client, message) {
    await message.delete();

    return message.channel.send(message.content.slice(5));
  }
};