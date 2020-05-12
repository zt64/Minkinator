module.exports = {
  description: 'Returns ping and web socket information.',
  aliases: ['ws'],
  async execute (client, message, args) {
    const guildConfig = await client.database.properties.findByPk('configuration').then(key => key.value);
    const successColor = guildConfig.colors.success;
    const ws = client.ws;
    const pms = client.pms;

    const connections = ['READY', 'CONNECTING', 'RECONNECTING', 'IDLE', 'NEARLY', 'DISCONNECTED'];

    const pingMessage = await message.channel.send('Pinging...');

    const apiPing = Math.round(ws.ping);

    const start = process.hrtime.bigint();
    await client.fetch('https://www.google.com');
    const end = process.hrtime.bigint();

    const connectionPing = pms(Number(end - start) / 1e+6);

    const connectionStatus = connections[ws.status];
    const gateway = ws.gateway;

    return pingMessage.edit(new client.Discord.MessageEmbed()
      .setColor(successColor)
      .setTitle('Ping')
      .addField('API Ping:', `\`${apiPing}ms\``, true)
      .addField('Connection Ping:', `\`${connectionPing}\``, true)
      .addField('Connection Status:', `\`${connectionStatus}\``, true)
      .addField('Gateway:', `\`${gateway}\``, true)
    );
  }
};