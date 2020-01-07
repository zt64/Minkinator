module.exports = {
  name: 'clear',
  category: 'Administrator',
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
    if (isNaN(args[0]) || args[0] < 1) return message.channel.send('Please enter a valid number between 1 and 100');

    return message.channel.bulkDelete(Math.round(args[0]));
  }
};