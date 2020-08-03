module.exports = {
  description: "Get a scaled up version of emojis.",
  aliases: ["emoji", "scale"],
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
  async execute (client, message, args) {
    const guildConfig = await client.database.properties.findByPk("configuration").then(key => key.value);
    const successColor = guildConfig.colors.success;
    const twemoji = require("twemoji");
    const messageEmoji = args[0];

    let url;

    // Test if emoji is a guild emoji

    if (messageEmoji.match(/:/)) {
      const match = messageEmoji.match(/\d+/);

      if (match == null) return message.channel.send(`\`${messageEmoji}\` is not a valid emoji.`);

      url = client.emojis.cache.get(match[0]).url;
    } else {
      const emoji = twemoji.parse(messageEmoji);

      if (emoji === messageEmoji) return message.channel.send(`\`${messageEmoji}\` is not a valid emoji.`);

      url = emoji.match(/http.+png/)[0];
    }

    const emojiEmbed = new client.Discord.MessageEmbed()
      .setColor(successColor)
      .setTitle("Scaled emoji")
      .setURL(url)
      .setImage(url);

    return message.channel.send(emojiEmbed);
  }
};