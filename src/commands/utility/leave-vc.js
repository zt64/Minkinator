module.exports = {
  description: 'Join voice chat.',
  async execute (client, message, args) {
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.leave();
    }
  }
};