module.exports = {
  name: 'say',
  description: 'Repeats a users input.',
  aliases: ['repeat'],
  usage: '[string]',
  args: true,
  async execute (client, message) {
    await message.delete();

    return message.channel.send(message.content.slice(5));
  }
};
