const fetch = require("node-fetch");

module.exports = {
  description: "Get a random joke.",
  async execute (client, message) {
    const { colors } = await global.sequelize.models.guildConfig.findByPk(message.guild.id);
    const response = await fetch("https://icanhazdadjoke.com/", {
      headers: { "Accept": "application/json" }
    });

    const json = await response.json();

    const embed = new Discord.MessageEmbed({
      color: colors.default,
      title: "Joke",
      description: json.joke,
    });

    return message.channel.send(embed);
  }
};