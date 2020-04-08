module.exports = {
  description: 'Send a direct message to a user.',
  permissions: ['ADMINISTRATOR'],
  parameters: [
    {
      name: 'user',
      type: String
    },
    {
      name: 'message',
      type: String
    }
  ],
  async execute (client, message, args) {
    const user = message.mentions.users.first();
    const msg = args[1];

    user.send(msg);

    return message.channel.send(`Sent a DM to ${user}`);
  }
};