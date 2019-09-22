module.exports = {
  name: 'markov',
  description: 'Generates a markov chain',
  usage: '<input>',
  async execute (client, message, args) {
    const rita = client.rita;
    const rm = new rita.RiMarkov(4);

    rm.loadFrom('./data.txt', function () {
      console.log(rm.generateSentence(1));
    });
  }
};
