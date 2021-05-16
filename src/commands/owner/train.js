module.exports = {
  description: "Search past message history and add it to the database for the current guild.",
  parameters: [
    {
      name: "limit",
      type: Number,
      required: true
    }
  ],
  async execute (_, message, [ limit ]) {
    const messageManager = message.channel.messages;

    if (limit <= 0) return message.reply("Message limit must be a whole number above zero.");

    if (limit <= 100) {
      const messages = await messageManager.fetch({ limit });
      console.log(messages.map(message => message.content));
    }
  }
};