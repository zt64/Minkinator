const chalk = require("chalk");

module.exports = {
  description: "Generates a markov chain.",
  aliases: [ "mkv" ],
  async execute (_, message) {
    const { data } = await global.sequelize.models.guild.findByPk(message.guild.id);

    try {
      const sentence = await util.generateSentence(data);
      message.reply(sentence);
      console.log(chalk`{cyan (${message.guild.name} #${message.channel.name})} {green Sent markov:} ${sentence}`);
      // message.reply(await util.generateSentence(guildInstance.data), { allowedMentions: { parse: [ ] } });
    } catch (error) {
      return;
    }
  }
};