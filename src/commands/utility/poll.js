module.exports = {
  description: "Create a poll.",
  async execute (client, message, args) {
    const { colors } = global.guildInstance.config;

    // Create embed
    const pollEmbed = new global.Discord.MessageEmbed()
      .setColor(colors.default)
      .setTitle("Quick poll");

    // Add options
    args.forEach(option => {
      pollEmbed.addField(option);
    });

    return message.channel.send(pollEmbed);
  }
};
