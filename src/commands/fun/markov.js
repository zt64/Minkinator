module.exports = {
  description: "Generates a markov chain.",
  async execute (client, message, args) {
    const guildConfig = await client.database.properties.findByPk("configuration").then(key => key.value);
    const data = await client.database.properties.findByPk("data").then(key => key.value);
    const successColor = guildConfig.colors.success;
    const markovTries = guildConfig.markovTries;
    const markovScore = guildConfig.markovScore;

    const { formatNumber } = client.functions;

    const options = {
      maxTries: markovTries,
      prng: Math.random(),
      filter: (result) => result.score > markovScore && result.refs.length >= 2 && result.string.length <= 500
    };

    try {
      const result = await client.database.markov.generateAsync(options);

      if (args[0] === "debug") console.log(result);

      return message.channel.send(result.string);
    } catch (error) {
      return message.channel.send(new client.Discord.MessageEmbed()
        .setColor(successColor)
        .setTitle("Markov generation unsuccessful")
        .setDescription(`An error has occurred or the guild does not have enough data. Contact a server administrator to change \`markov.score\` and \`markov.tries\` in the guild config. \nCurrently there are: \`${formatNumber(data.length)}\` strings of data.`)
      );
    }
  }
};