module.exports = {
  description: 'Generates a markov chain',
  async execute (client, message, args) {
    const guildConfig = client.database.properties.findByPk('configuration').then(key => key.value);
    const markovTries = guildConfig.markovTries;
    const markovScore = guildConfig.markovScore;

    const options = {
      maxTries: markovTries,
      filter: result => result.score > markovScore
    };

    const result = client.database.markov.generate(options);

    if (args[0] === 'debug') console.log(result);

    return message.channel.send(result.string);
  }
};