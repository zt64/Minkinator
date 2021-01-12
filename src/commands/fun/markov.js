const MarkovChain = require("purpl-markov-chain");

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
    const chain = new MarkovChain(global.guildInstance.corpus);

    chain.config.grams = util.randomInteger(1, 3);

    if (startWord) chain.config.from = startWord;

    return message.channel.send(chain.generate());
  }
};