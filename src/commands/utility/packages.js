const { dependencies } = require(`${__basedir}/../package.json`);

module.exports = {
  description: "Shows all the packages that Minkinator is using.",
  aliases: ["pkg", "pkgs"],
  async execute (client, message) {
    const packageEmbed = new Discord.MessageEmbed({
      color: global.guildInstance.config.colors.default,
      title: "Packages"
    });

    // Add packages to embed
    for (const [key, value] of Object.entries(dependencies)) {
      packageEmbed.addField(key, value, true);
    }

    return message.channel.send(packageEmbed);
  }
};
