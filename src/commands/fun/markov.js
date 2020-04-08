module.exports = {
  description: 'Generates a markov chain',
  async execute (client, message, args) {
    const options = {
      maxTries: 1000,
      filter: result => result.refs.length > 4
    };

    const result = client.database.markov.generate(options);

    if (args[0] === 'debug') {
      return message.channel.send(JSON.stringify(result, null, 2), { code: 'json' });
    }

    console.log(result);
    return message.channel.send(result.string);
  }
};