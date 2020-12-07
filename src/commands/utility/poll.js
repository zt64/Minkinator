module.exports = {
  description: "Create a poll.",
  async execute (client, message, args) {
    // Create embed
    const pollEmbed = new global.Discord.MessageEmbed({
      color: global.guildInstance.config.colors.default,
      title: "Quick Poll"
    });

    // Add options
    args.forEach(option => pollEmbed.addField(option));

    return message.channel.send(pollEmbed);
  }
};
