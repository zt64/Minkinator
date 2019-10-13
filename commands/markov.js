module.exports = {
  name: 'markov',
  description: 'Generates a markov chain',
  usage: '<input> <length>',
  async execute (client, message, args) {
    const markov = client.markov;

    return message.channel.send(markov.generate(args[0], parseInt(args[1])), { disableEveryone: true });
  }
};
