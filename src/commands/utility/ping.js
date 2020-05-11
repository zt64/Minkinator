const ms = require('ms');

module.exports = {
  description: 'Returns ping and web socket information.',
  aliases: ['ws'],
  async execute (client, message, args) {
    const guildConfig = await client.database.properties.findByPk('configuration').then(key => key.value);
    const successColor = guildConfig.embedColors.success;

    const ws = client.ws;
    const connections = ['READY', 'CONNECTING', 'RECONNECTING', 'IDLE', 'NEARLY', 'DISCONNECTED'];

    const apiPing = Math.round(ws.ping);
    const now = process.hrtime.bigint();
    const m = await message.channel.send('Pinging...');
    const end = process.hrtime.bigint();
    const nower = process.hrtime.bigint();
    await client.fetch('https://google.com');
    const ender = process.hrtime.bigint();
    const connectionStatus = connections[ws.status];
    const gateway = ws.gateway;

    return m.edit(new client.Discord.MessageEmbed()
      .setColor(successColor)
      .setTitle('Ping')
      .addField('API Ping:', `\`${apiPing}ms\``, true)
      .addField('Response Time:', `\`${ms(Number(end - now))}\``, true)
      .addField('Connection Ping:', `\`${ms(Number(ender - nower))}\``, true)
      .addField('Connection Status:', `\`${connectionStatus}\``, true)
      .addField('Gateway:', `\`${gateway}\``, true)
    );
  }
};