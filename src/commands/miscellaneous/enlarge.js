module.exports = {
  description: 'Enlarges an emoji',
  parameters: [
    {
      name: 'emoji',
      type: String
    }
  ],
  async execute (client, message, args) {
    const emoji = client.emojis.find(emoji => emoji === args[0]);

    return message.channel.send(emoji.url);
  }
};