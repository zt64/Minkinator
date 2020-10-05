module.exports = {
  description: "Shows the current time.",
  async execute (client, message) {
    const guildConfig = global.guildInstance.guildConfig;
    const defaultColor = guildConfig.colors.default;

    const moment = global.moment;

    // Create embed
    const timeEmbed = new global.Discord.MessageEmbed()
      .setColor(defaultColor)
      .setTitle("Time / Date")
      .addField("UTC Date:", moment.utc().format("dddd MMMM DD, YYYY"))
      .addField("UTC Time:", moment.utc().format("kk:mm:ss"))
      .addField("Unix Timestamp:", moment().unix());

    return message.channel.send(timeEmbed);
  }
};