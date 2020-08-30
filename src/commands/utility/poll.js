module.exports = {
  description: "Create a poll.",
  async execute (client, message, args) {
    const guildConfig = await client.database.properties.findByPk("configuration").then(key => key.value);
    const embedColor = guildConfig.colors.default;
    const options = args;

    // Create embed
    const pollEmbed = new global.Discord.MessageEmbed()
      .setColor(embedColor)
      .setTitle("Quick poll");

    // Add options
    options.forEach(option => {
      pollEmbed.addField(option);
    });

    return message.channel.send(pollEmbed);
  }
};
