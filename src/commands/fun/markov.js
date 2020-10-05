module.exports = {
  description: "Generates a markov chain.",
  aliases: [ "mkv" ],
  async execute (client, message) {
    const data = global.guildInstance.data;
    const markov = global.markov(1);

    markov.seed(data.join(""));

    const key = markov.pick();

    return message.channel.send(markov.forward(key));
  }
};