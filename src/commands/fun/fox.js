module.exports = {
  description: "Gets a random fox image.",
  async execute (client, message) {
    const guildConfig = global.guildInstance.config;
    const defaultColor = guildConfig.colors.default;
    
    const fox = await util.fetchJSON("https://randomfox.ca/floof/");

    const foxEmbed = new global.Discord.MessageEmbed({
      color: defaultColor,
      title: "Random Fox",
      url: fox.link,
      image: { url: fox.image },
      footer: { text: "Source: https://randomfox.ca/floof/" }
    });

    return message.channel.send(foxEmbed);
  }
};
