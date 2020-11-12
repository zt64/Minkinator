module.exports = {
  description: "Set the current channels slow mode.",
  aliases: ["slow"],
  parameters: [
    {
      name: "seconds",
      type: Number,
      required: true
    }
  ],
  async execute (client, message, [ seconds ]) {
    const { channel } = message;

    await channel.setRateLimitPerUser(seconds);

    return message.channel.send(`Successfully set the rate limit per user to ${seconds} seconds.`);
  }
};