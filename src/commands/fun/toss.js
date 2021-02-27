module.exports = {
  description: "Flip a coin.",
  aliases: ["flip", "coin"],
  async execute (client, message) {
    const { colors } = await global.sequelize.models.guildConfig.findByPk(message.guild.id);

    // Generate result
    const result = Math.random() > 0.5 ? "Heads" : "Tails";

    // Send embed
    return message.reply({
      embed: {
        color: colors.default,
        title: "Coin Toss",
        description: result
      }
    });
  }
};