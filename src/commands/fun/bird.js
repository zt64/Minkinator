module.exports = {
  description: "Get a random picture of a bird!",
  aliases: [ "birb" ],
  async execute (client, message) {
    const { colors } = await global.sequelize.models.guildConfig.findByPk(message.guild.id);
    const { link } = await util.fetchJSON("https://some-random-api.ml/img/birb");

    return message.reply({
      embed: {
        color: colors.default,
        title: "Random Bird",
        url: link,
        image: { url: link },
        footer: { text: "Source: https://some-random-api.ml/img/birb" }
      }
    });
  }
};