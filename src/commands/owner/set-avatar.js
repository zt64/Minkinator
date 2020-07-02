module.exports = {
  description: "Change the bots avatar.",
  parameters: [
    {
      name: "avatar",
      type: String,
      required: true
    }
  ],
  async execute (client, message, args) {
    const avatar = args[0];

    await client.user.setAvatar(avatar);

    return message.channel.send("Successfully changed bot avatar.");
  }
};