module.exports = {
  description: "Shows the exact time.",
  async execute (client, message, args) {
    const moment = client.moment;
    const guildConfig = await client.database.properties.findByPk("configuration").then(key => key.value);
    const defaultColor = guildConfig.colors.default;

    // Create embed
    const timeEmbed = new client.Discord.MessageEmbed()
      .setColor(defaultColor)
      .setTitle("Time / Date")
      .addField("UTC Date:", moment.utc().format("dddd MMMM DD, YYYY"))
      .addField("UTC Time:", moment.utc().format("kk:mm:ss"))
      .addField("Unix Timestamp:", moment().unix());

    return message.channel.send(timeEmbed);
  }
};