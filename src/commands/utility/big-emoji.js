const twemoji = require("twemoji");

module.exports = {
  description: "Get a scaled up version of an emoji.",
  aliases: ["emoji"],
  parameters: [
    {
      name: "emoji",
      type: String,
      required: true
    }
  ],
  async execute (client, message, [ messageEmoji ]) {
    const { colors } = global.guildInstance.config;

    let url;

    // Check if emoji is a guild emoji
    if (messageEmoji.match(/:/)) {
      const match = messageEmoji.match(/\d+/);

      if (match == null) return message.channel.send(`\`${messageEmoji}\` is not a valid emoji.`);

      url = client.emojis.cache.get(match[0]).url;
    } else {
      const emoji = twemoji.parse(messageEmoji);

      if (emoji === messageEmoji) return message.channel.send(`\`${messageEmoji}\` is not a valid emoji.`);

      [ url ] = emoji.match(/http.+png/);
    }

    return message.channel.send(new Discord.MessageEmbed({
      color: colors.default,
      title: "Scaled Emoji",
      url: url,
      image: { url }
    }));
  }
};