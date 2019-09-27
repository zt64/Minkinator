module.exports = {
  name: 'markov',
  description: 'Generates a markov chain',
  usage: '<input>',
  async execute (client, message, args) {
    const markov = client.markov;

    markov.addStates(require('../data.json'));
    markov.train(4);

    message.channel.send(markov.generateRandom(2000));
  }
};
