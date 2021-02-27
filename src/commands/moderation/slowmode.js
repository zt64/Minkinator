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
    await message.channel.setRateLimitPerUser(seconds);

    return message.reply(`Successfully set the rate limit per user to ${seconds} seconds.`);
  }
};