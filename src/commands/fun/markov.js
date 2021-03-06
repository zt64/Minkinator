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

    try {
      const sentence = start ? await util.generateSentence(data, start) : await util.generateSentence(data);
      return message.reply(sentence);
    } catch (error) {
      return message.reply("Failed to generate a sentence, database may need more data.");
    }
  }
};