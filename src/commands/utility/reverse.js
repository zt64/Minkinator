module.exports = {
  description: "Reverses a string.",
  parameters: [
    {
      name: "string",
      type: String,
      required: true
    }
  ],
  async execute (client, message, string) {
    const { colors } = await global.sequelize.models.guildConfig.findByPk(message.guild.id);

    const flipped = string.join(" ").split("").reverse().join("");

    return message.channel.send({ embed: {
      color: colors.default,
      title: "Reversed Text",
      description: flipped
    } });
  }
};