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

          return message.channel.send("Joined voice channel.");
        } else {
          return message.channel.send("Not in a voice channel.");
        }
      }
    },
    {
      name: "leave",
      description: "Leave the current voice channel.",
      async execute (client, message) {
        if (client.voice.connections.size >= 1) {
          await client.voice.connections.first().channel.leave();

          return message.channel.send("Left voice channel.");
        } else {
          return message.channel.send("Not in a voice channel.");
        }
      }
    },
    {
      name: "play",
      description: "Play audio from a URL in a voice channel.",
      async execute (client, message, args) {
        if (client.voice.connections.size >= 1) {
          const connection = client.voice.connections.first();
          const url = args[0];

          // Play URL
          const dispatcher = connection.play(url);

          dispatcher.on("error", console.error);
        } else {
          return message.channel.send("Must be in voice channel before running.");
        }
      }
    }
  ]
};
