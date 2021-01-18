const prettyMilliseconds = require("pretty-ms");
const fetch = require("node-fetch");

module.exports = {
  description: "Returns ping and web socket information.",
  aliases: ["ws"],
  async execute (client, message) {
    const { colors } = await global.sequelize.models.guildConfig.findByPk(message.guild.id);
    
    const { ws } = client;

    const connections = ["READY", "CONNECTING", "RECONNECTING", "IDLE", "NEARLY", "DISCONNECTED"];

    const pingEmbed = new Discord.MessageEmbed({
      color: colors.default,
      title: "Pinging..."
    });

    const pingMessage = await message.channel.send(pingEmbed);

    const apiPing = Math.round(ws.ping);

    // Check connection ping
    const start = process.hrtime.bigint();
    await fetch("https://www.google.com");
    const end = process.hrtime.bigint();

    const connectionPing = prettyMilliseconds(Number(end - start) / 1e+6);
    const connectionStatus = connections[ws.status];
    const { gateway } = ws;

    // Edit embed
    pingEmbed.setTitle("Ping Information");

    pingEmbed.addField("API Ping:", `\`${apiPing}ms\``, true);
    pingEmbed.addField("Connection Ping:", `\`${connectionPing}\``, true);
    pingEmbed.addField("Connection Status:", `\`${connectionStatus}\``, true);
    pingEmbed.addField("Gateway:", `\`${gateway}\``, true);

    return pingMessage.edit(pingEmbed);
  }
};