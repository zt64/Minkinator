module.exports = {
  description: "Gets a random dog image.",
  async execute (client, message) {
    const { colors } = await global.sequelize.models.guildConfig.findByPk(message.guild.id);

    let dog = await util.fetchJSON("https://random.dog/woof.json");

    while (dog.url.endsWith("mp4")) dog = await util.fetchJSON("https://random.dog/woof.json");

    return message.channel.send({ embed: {
      color: colors.default,
      title: "Random Dog",
      url: dog.url,
      image: { url: dog.url },
      footer: { text: "Source: https://random.dog/woof.json" }
    } });
  }
};
