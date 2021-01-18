module.exports = {
  description: "Create a poll.",
  parameters: [
    {
      name: "options",
      required: true
    }
  ],
  async execute (client, message, args) {
    if (args.length > 9) return message.channel.send("Currently only nine poll options are possible.");

    const pollEmbed = new Discord.MessageEmbed({
      color: global.guildInstance.config.colors.default,
      title: "Quick Poll"
    });

    // Add options
    args.forEach(option => pollEmbed.addField(option, 0, true));

    const pollMessage = await message.channel.send(pollEmbed);

    const collector = pollMessage.createReactionCollector();

    collector.on("collect", async reaction => {
      const emoji = reaction.emoji.name;

      pollMessage.edit(pollEmbed);
    });
  }
};
