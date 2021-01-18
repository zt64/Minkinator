module.exports = {
  description: "Gets a random fox image.",
  async execute (client, message) {
    const { colors } = await global.sequelize.models.guildConfig.findByPk(message.guild.id);
    
    const fox = await util.fetchJSON("https://randomfox.ca/floof/");

    const foxEmbed = new Discord.MessageEmbed({
      color: colors.default,
      title: "Random Fox",
      url: fox.link,
      image: { url: fox.image },
      footer: { text: "Source: https://randomfox.ca/floof/" }
    });

    return message.channel.send(foxEmbed);
  }
};
