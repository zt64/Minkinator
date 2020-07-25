module.exports = {
  description: "Join voice chat.",
  async execute (client, message, args) {
    if (message.member.voice.channel) {
      await message.member.voice.channel.join();
    } else {
      return message.channel.send("Not in voice channel.");
    }
  }
};