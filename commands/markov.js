module.exports = {
  name: 'markov',
  description: 'Generates a markov chain',
  usage: '<input>',
  async execute (client, message, args) {
    const markov = client.markov;

    return message.channel.send(markov.generate(args.join(' '), 1000), { disableEveryone: true });
  }
};
