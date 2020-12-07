const os = require("os");
const prettyBytes = require("pretty-bytes");
const prettyMilliseconds = require("pretty-ms");

module.exports = {
  description: "Returns information about the host OS.",
  aliases: ["os"],
  async execute (client, message) {
    const guildConfig = global.guildInstance.config;
    const defaultColor = guildConfig.colors.default;

    // Create and send embed
    return message.channel.send(new global.Discord.MessageEmbed({
      color: defaultColor,
      title: "Host OS Information",
      fields: [
        { name: "Platform", value: os.platform(), inline: true },
        { name: "Architecture", value: os.arch(), inline: true },
        { name: "Release", value: os.release(), inline: true },
        { name: "Hostname", value: os.hostname(), inline: true },
        { name: "Home Directory", value: os.homedir(), inline: true },
        { name: "Free Memory:", value: prettyBytes(os.freemem()), inline: true },
        { name: "Total Memory:", value: prettyBytes(os.totalmem()), inline: true },
        { name: "System Uptime:", value: prettyMilliseconds(os.uptime() * 1000), inline: true },
        { name: "CPU:", value: os.cpus()[0].model, inline: true },
        { name: "Node Version:", value: process.version, inline: true },
        { name: "Node Uptime:", value: prettyMilliseconds(process.uptime() * 1000), inline: true },
      ]
    }));
  }
};