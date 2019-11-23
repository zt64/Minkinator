module.exports = {
  name: 'say',
  description: 'Says a string of text.',
  aliases: ['repeat'],
  usage: '[string]',
  args: true,
  async execute (client, message) {
    await message.delete();

    return message.channel.send(message.content.slice(5));
  }
};
