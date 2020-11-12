module.exports = {
  description: "Shows all the packages that Minkinator is using.",
  aliases: ["pkg", "pkgs"],
  async execute (client, message) {
    const { colors } = global.guildInstance.config;

    const { dependencies } = require("../../../package.json");

    // Create embed
    const packageEmbed = new global.Discord.MessageEmbed()
      .setColor(colors.default)
      .setTitle("Packages");

    // Add packages to embed
    for (const [key, value] of Object.entries(dependencies)) {
      packageEmbed.addField(key, value, true);
    }

    return message.channel.send(packageEmbed);
  }
};
