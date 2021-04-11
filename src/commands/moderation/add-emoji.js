module.exports = {
  description: "Add an emoji to the current guild.",
  parameters: [
    {
      name: "url",
      type: String,
      required: true
    },
    {
      name: "name",
      type: String,
      required: true
    }
  ],
  async execute (client, message, [ url, name ]) {
    message.guild.emojis.create(url, name);

    return message.reply({
      embed: {
        color: global.config.colors.default,
        title: "Added New Custom Emoji"
      }
    });
  }
};