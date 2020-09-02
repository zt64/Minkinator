module.exports = {
  description: "Generates a markov chain.",
  async execute (client, message) {
    const data = await client.database.properties.findByPk("data").then(key => key.value);
    const markov = global.Markov(4);

    const limit = global.functions.randomInteger(1, 10);

    // Seed the generator
    markov.seed(data.join("\n"));

    // Get random key
    const key = markov.pick();

    // Generate chains from key
    const chains = markov.forward(key);

    // Generate responses based off the chains
    let responses = markov.respond(chains.join(" "), limit);

    // Send the response
    return message.channel.send(responses.join(" "));
  }
};