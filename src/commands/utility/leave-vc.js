module.exports = {
  description: "Join voice chat.",
  async execute (client, message, args) {
    if (client.voice.connections.size >= 1) {
      await client.voice.connections.first().channel.leave();
    }
  }
};