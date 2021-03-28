const ytdl = require("ytdl-core-discord");

module.exports = {
  description: "Commands for interaction with voice chat.",
  aliases: ["vc"],
  subCommands: [
    {
      name: "join",
      description: "Join the current voice channel of message author.",
      async execute (client, message) {
        if (message.member.voice.channel) {
          await message.member.voice.channel.join();

          return message.reply("Joined voice channel.");
        } else {
          return message.reply("Not in a voice channel.");
        }
      }
    },
    {
      name: "leave",
      description: "Leave the current voice channel.",
      async execute (client, message) {
        if (client.voice.connections.size >= 1) {
          await client.voice.connections.first().channel.leave();

          return message.reply("Left voice channel.");
        } else {
          return message.reply("Not in a voice channel.");
        }
      }
    },
    {
      name: "play",
      description: "Play audio from a URL in a voice channel.",
      parameters: [
        {
          name: "url",
          type: String,
          required: true
        }
      ],
      async execute (client, message, [ url ]) {
        if (client.voice.connections.size === 0) return message.reply("Must be in voice channel before running.");

        const connection = client.voice.connections.first();
        let dispatcher;

        try {
          dispatcher = connection.play(await ytdl(url), { type: "opus", volume: false });
        } catch (error) {
          try {
            dispatcher = connection.play(url);
          } catch (error) {
            return message.reply("Failed to play URL.");
          }
        }

        dispatcher.on("error", console.error);
      }
    }
  ]
};
