module.exports = {
  description: "Generates a markov chain.",
  aliases: [ "mkv" ],
  async execute (client, message) {
    const corpus = global.guildInstance.data;
    const chain = new global.markov();

    chain.config.grams = global.functions.randomInteger(1, 3);

    corpus.map(sentence => chain.update(sentence));

    const phrase = [];
    const n = 3;

    for (let i = 0; i < n; i++) {
      const sentence = chain.generate();
      phrase.push(sentence);

      const words = sentence.split(" ");

      if (words.length === 1) break;
      if (words.length > 1) chain.config.from = words[words.length - 2];
    }

    console.log(phrase);

    return message.channel.send(phrase.join(" "));
  }
};