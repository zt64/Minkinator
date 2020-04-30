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
    const user = message.mentions.users.first() || args[0];
    const msg = args[1];

    await user.send(msg);

    return message.channel.send(`Sent a DM to \`${user}\``);
  }
};