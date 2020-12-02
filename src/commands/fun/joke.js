module.exports = {
  description: "Tells a joke.",
  async execute (client, message, args) {
    const response = await global.fetch("https://icanhazdadjoke.com/", {
      headers: { 
        "Accept": "application/json" }
    });

    const json = await response.json();

    const embed = new global.Discord.MessageEmbed({
      color: global.guildInstance.config.colors.default,
      title: "Joke",
      description: json.joke,
    });

    return message.channel.send(embed);
  }
};