module.exports = {
  description: "Returns information about the host OS.",
  aliases: ["os"],
  async execute (client, message, args) {
    const guildConfig = await client.database.properties.findByPk("configuration").then(key => key.value);
    const successColor = guildConfig.colors.success;

    const pms = client.pms;

    const os = require("os");

    return message.channel.send(new client.Discord.MessageEmbed()
      .setColor(successColor)
      .setTitle("OS Information")
      .addField("Platform:", os.platform(), true)
      .addField("Architecture:", os.arch(), true)
      .addField("Release:", os.release(), true)
      .addField("Hostname:", os.hostname(), true)
      .addField("Home Directory:", os.homedir(), true)
      .addField("Free Memory:", `${(os.freemem() / 1e+9).toFixed(2)} GB`, true)
      .addField("Total Memory:", `${(os.totalmem() / 1e+9).toFixed(2)} GB`, true)
      .addField("System Uptime:", pms(os.uptime() * 1000), true)
      .addField("CPU:", os.cpus()[0].model)
      .addField("Discord.js Version:", require("discord.js").version, true)
      .addField("Node Version:", process.version, true)
      .addField("Node Uptime:", pms(process.uptime() * 1000), true)
    );
  }
};