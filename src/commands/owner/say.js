module.exports = {
  description: "Says a string of text.",
  aliases: [ "echo" ],
  parameters: [
    {
      name: "string",
      type: String,
      required: true
    }
  ],
  async execute (client, message, string) {
    // Delete message
    await message.delete();

    // Send message
    return message.channel.send(string.join(" "));
  }
};