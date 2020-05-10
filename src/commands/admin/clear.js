module.exports = {
  description: 'Removes a set amount of messages.',
  aliases: ['purge', 'sweep'],
  permissions: ['MANAGE_MESSAGES'],
  parameters: [
    {
      name: 'messages',
      type: Number,
      required: true
    }
  ],
  async execute (client, message, args) {
    let messages = parseInt(args[0]);

    if (isNaN(messages) || messages < 1) return message.channel.send('Please enter a number between 1 and 100');

    if (messages !== 100) messages += 1;

    return message.channel.bulkDelete(Math.round(messages));
  }
};