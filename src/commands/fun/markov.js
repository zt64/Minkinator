module.exports = {
  description: "Generates a markov chain.",
  aliases: [ "mkv" ],
  async execute (client, message) {
    const corpus = global.guildInstance.data;
    const chain = new global.markov();

    chain.config.grams = global.functions.randomInteger(1, 3);

    corpus.map(sentence => chain.update(sentence));
    
    let result = chain.generate();

    if (result.length < 5) {
      chain.config.from = result;

      result = chain.generate();
    }

    return message.channel.send(chain.generate());
  }
};