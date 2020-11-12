module.exports = {
  description: "Shows the current time.",
  async execute (client, message) {
    const { moment, guildInstance: { config: { colors } } } = global;

    // Create embed
    const timeEmbed = new global.Discord.MessageEmbed()
      .setColor(colors.default)
      .setTitle("Time / Date")
      .addField("UTC Date:", moment.utc().format("dddd MMMM DD, YYYY"))
      .addField("UTC Time:", moment.utc().format("kk:mm:ss"))
      .addField("Unix Timestamp:", moment().unix());

    return message.channel.send(timeEmbed);
  }
};