module.exports = {
  description: "Says a string of text.",
  parameters: [
    {
      name: "string",
      type: String,
      required: true
    }
  ],
  async execute (client, message, args) {
    // Delete message
    await message.delete();

    // Send message
    return message.channel.send(args.join(" "));
  }
};