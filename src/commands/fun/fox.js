module.exports = {
  description: "Gets a random fox image.",
  async execute (client, message) {
    const fox = await util.fetchJSON("https://randomfox.ca/floof/");

    return message.reply({
      embed: {
        color: global.config.colors.default,
        title: "Random Fox",
        url: fox.link,
        image: { url: fox.image },
        footer: { text: "Source: https://randomfox.ca/floof/" }
      }
    });
  }
};
