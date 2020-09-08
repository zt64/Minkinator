module.exports = {
  description: "Returns ping and web socket information.",
  aliases: ["ws"],
  async execute (client, message) {
    const guildConfig = global.guildInstance.guildConfig;
    const defaultColor = guildConfig.colors.default;
    
    const pms = global.pms;
    const ws = client.ws;

    const connections = ["READY", "CONNECTING", "RECONNECTING", "IDLE", "NEARLY", "DISCONNECTED"];

    const pingEmbed = new global.Discord.MessageEmbed()
      .setColor(defaultColor)
      .setTitle("Pinging...");

    const pingMessage = await message.channel.send(pingEmbed);

    const apiPing = Math.round(ws.ping);

    // Check connection ping
    const start = process.hrtime.bigint();
    await global.fetch("https://www.google.com");
    const end = process.hrtime.bigint();

    const connectionPing = pms(Number(end - start) / 1e+6);
    const connectionStatus = connections[ws.status];
    const gateway = ws.gateway;

    // Edit embed
    pingEmbed.setTitle("Ping Information");

    pingEmbed.addField("API Ping:", `\`${apiPing}ms\``, true);
    pingEmbed.addField("Connection Ping:", `\`${connectionPing}\``, true);
    pingEmbed.addField("Connection Status:", `\`${connectionStatus}\``, true);
    pingEmbed.addField("Gateway:", `\`${gateway}\``, true);

    return pingMessage.edit(pingEmbed);
  }
};