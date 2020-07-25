module.exports = {
  description: "Play an audio source in voice chat.",
  parameters: [
    {
      name: "source",
      type: String,
      required: true
    }
  ],
  async execute (client, message, args) {
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();

      const dispatcher = connection.play(args[0]);

      dispatcher.on("start", () => {
        message.channel.send("Now playing audio.");
      });

      dispatcher.on("finish", () => {
        message.channel.send("Finished playing audio.");

        client.voice.connections.first().channel.leave();
      });

      dispatcher.on("error", console.error);
    } else {
      return message.channel.send("You must be in a voice channel to play audio.");
    }
  }
};
