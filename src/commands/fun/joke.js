module.exports = {
  description: "Get a random joke.",
  async execute (_, message) {
    const response = await util.fetchJSON("https://icanhazdadjoke.com/", {
      headers: { "Accept": "application/json" }
    });

    return message.reply({
      embed: {
        color: global.config.colors.default,
        title: "Joke",
        description: response.joke,
      }
    });
  }
};