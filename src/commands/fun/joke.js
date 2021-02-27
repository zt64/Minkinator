module.exports = {
  description: "Get a random joke.",
  async execute (client, message) {
    const { colors } = await global.sequelize.models.guildConfig.findByPk(message.guild.id);
    const response = await util.fetchJSON("https://icanhazdadjoke.com/", {
      headers: { "Accept": "application/json" }
    });

    return message.reply({
      embed: {
        color: colors.default,
        title: "Joke",
        description: response.joke,
      }
    });
  }
};