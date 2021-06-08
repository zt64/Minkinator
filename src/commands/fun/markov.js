const chalk = require("chalk");

module.exports = {
  description: "Generate a sentence using markov.",
  aliases: [ "mkv" ],
  async execute (_, message) {
    if (!global.markov[message.guild.id]) return message.reply("Markov corpus has not been initialized yet.");

    try {
      const sentence = await util.generateSentence(global.markov[message.guild.id]);
      console.log(chalk`{cyan (${message.guild.name} #${message.channel.name})} {green Sent markov:} ${sentence}`);
      return message.reply(sentence);
    } catch (error) {
      return message.reply("Failed to generate sentence, there may not be enough data.");
    }
  }
};