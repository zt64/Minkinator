module.exports = {
  description: "Returns ping and web socket information.",
  aliases: ["ws"],
  async execute (client, message, args) {
    const guildConfig = await client.database.properties.findByPk("configuration").then(key => key.value);
    const successColor = guildConfig.colors.success;
    const ws = client.ws;
    const pms = client.pms;

    const connections = ["READY", "CONNECTING", "RECONNECTING", "IDLE", "NEARLY", "DISCONNECTED"];

    const pingEmbed = new client.Discord.MessageEmbed()
      .setColor(successColor)
      .setTitle("Pinging...");

    const pingMessage = await message.channel.send(pingEmbed);

    const apiPing = Math.round(ws.ping);

    const start = process.hrtime.bigint();
    await client.fetch("https://www.google.com");
    const end = process.hrtime.bigint();

    const connectionPing = pms(Number(end - start) / 1e+6);
    const connectionStatus = connections[ws.status];
    const gateway = ws.gateway;

    pingEmbed.setTitle("Ping Information");

    pingEmbed.addField("API Ping:", `\`${apiPing}ms\``, true);
    pingEmbed.addField("Connection Ping:", `\`${connectionPing}\``, true);
    pingEmbed.addField("Connection Status:", `\`${connectionStatus}\``, true);
    pingEmbed.addField("Gateway:", `\`${gateway}\``, true);

    return pingMessage.edit(pingEmbed);
  }
};