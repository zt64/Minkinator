module.exports = {
  description: "Create a poll.",
  async execute (client, message, args) {
    const guildConfig = await client.database.properties.findByPk("configuration").then(key => key.value);
    const embedColor = guildConfig.colors.success;
    const options = args;

    const pollEmbed = new client.Discord.MessageEmbed()
      .setColor(embedColor)
      .setTitle("Quick poll");

    options.forEach(option => {
      pollEmbed.addField(option);
    });

    return message.channel.send(pollEmbed);
  }
};
