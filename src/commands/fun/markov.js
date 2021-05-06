module.exports = {
  description: "Generates a markov chain.",
  aliases: [ "mkv" ],
  async execute (_, message) {
    const { data } = await global.sequelize.models.guild.findByPk(message.guild.id, { include: { all: true } });

    try {
      message.reply(await util.generateSentence(data));
      // message.reply(await util.generateSentence(guildInstance.data), { allowedMentions: { parse: [ ] } });
    } catch (error) {
      return;
    }
  }
};