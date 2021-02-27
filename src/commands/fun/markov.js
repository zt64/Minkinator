module.exports = {
  description: "Generates a markov chain.",
  aliases: [ "mkv" ],
  parameters: [
    {
      name: "start word",
      type: String
    }
  ],
  async execute (client, message, [ start ]) {
    const { data } = await global.sequelize.models.guild.findByPk(message.guild.id, { include: { all: true } });

    return message.reply(await util.generateSentence(data, start));
  }
};