module.exports = {
  description: "Get a scaled up version of an emoji.",
  aliases: ["emoji"],
  parameters: [
    {
      name: "emoji",
      type: String,
      required: true
    },
    {
      name: "scale",
      type: Number
    }
  ],
  async execute (client, message, [ messageEmoji ]) {
    const guildConfig = global.guildInstance.guildConfig;
    const defaultColor = guildConfig.colors.default;

    const twemoji = require("twemoji");

    let url;

    // Check if emoji is a guild emoji
    if (messageEmoji.match(/:/)) {
      const match = messageEmoji.match(/\d+/);

      if (match == null) return message.channel.send(`\`${messageEmoji}\` is not a valid emoji.`);

      url = client.emojis.cache.get(match[0]).url;
    } else {
      const emoji = twemoji.parse(messageEmoji);

      if (emoji === messageEmoji) return message.channel.send(`\`${messageEmoji}\` is not a valid emoji.`);

      url = emoji.match(/http.+png/)[0];
    }

    const emojiEmbed = new global.Discord.MessageEmbed()
      .setColor(defaultColor)
      .setTitle("Scaled emoji")
      .setURL(url)
      .setImage(url);

    return message.channel.send(emojiEmbed);
  }
};