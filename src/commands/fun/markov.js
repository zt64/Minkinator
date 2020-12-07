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
    const corpus = global.guildInstance.data;
    const chain = new global.markov();

    corpus.map(sentence => chain.update(sentence));

    chain.config.grams = util.randomInteger(1, 3);
    if (startWord) chain.config.from = startWord;

    let sentence = chain.generate();
    let i = 0;
    
    while ((corpus.includes(sentence) || sentence.length <= 16) && i < 100) {
      sentence = chain.generate();
      i++;
    }

    return message.channel.send(sentence);
  }
};