module.exports = {
  name: 'usage',
  description: 'Testing new feature',
  aliases: ['ut'],
  parameters: [
    {
      name: 'Bool',
      type: Boolean,
      required: true
    },
    {
      name: 'String',
      type: String
    },
    {
      name: 'Number',
      type: Number
    }
  ],
  async execute (client, message, args) {
    message.channel.send('Yes.');
  }
};