module.exports = {
  description: "Generates a markov chain.",
  aliases: [ "mkv" ],
  parameters: [
    {
      name: "start word",
      type: String
    }
  ],
  async execute (client, message, [ startWord ]) {
    const { corpus } = await global.sequelize.models.guild.findByPk(message.guild.id, { include: { all: true } });

    return message.channel.send(await util.generateSentence(corpus, startWord));
  }
};