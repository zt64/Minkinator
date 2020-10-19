module.exports = {
  description: "Returns information about the host OS.",
  aliases: ["os"],
  async execute (client, message) {
    const guildConfig = global.guildInstance.config;
    const defaultColor = guildConfig.colors.default;

    const pms = global.pms;
    const os = global.os;

    const prettyBytes = global.pbs;

    // Create and send embed
    return message.channel.send(new global.Discord.MessageEmbed()
      .setColor(defaultColor)
      .setTitle("OS Information")
      .addField("Platform:", os.platform(), true)
      .addField("Architecture:", os.arch(), true)
      .addField("Release:", os.release(), true)
      .addField("Hostname:", os.hostname(), true)
      .addField("Home Directory:", os.homedir(), true)
      .addField("Free Memory:", prettyBytes(os.freemem()), true)
      .addField("Total Memory:", prettyBytes(os.totalmem()), true)
      .addField("System Uptime:", pms(os.uptime() * 1000), true)
      .addField("CPU:", os.cpus()[0].model)
      .addField("Discord.js Version:", `v${global.Discord.version}`, true)
      .addField("Node Version:", process.version, true)
      .addField("Node Uptime:", pms(process.uptime() * 1000), true)
    );
  }
};