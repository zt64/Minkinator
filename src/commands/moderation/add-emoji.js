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
    const { colors } = await global.sequelize.models.guildConfig.findByPk(message.guild.id);

    message.guild.emojis.create(url, name);

    return message.reply({
      embed: {
        color: colors.default,
        title: "Added New Custom Emoji"
      }
    });
  }
};