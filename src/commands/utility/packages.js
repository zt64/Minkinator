module.exports = {
  description: "Shows all the packages that Minkinator is using.",
  async execute (client, message, args) {
    const guildConfig = await client.database.properties.findByPk("configuration").then(key => key.value);
    const successColor = guildConfig.colors.success;

    const { dependencies } = require("../../../package.json");

    const packageEmbed = new client.Discord.MessageEmbed()
      .setColor(successColor)
      .setTitle("Packages");

    for (const [key, value] of Object.entries(dependencies)) {
      packageEmbed.addField(key, value, true);
    }

    message.channel.send(packageEmbed);
  }
};
