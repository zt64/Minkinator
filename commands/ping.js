module.exports = {
  name: 'ping',
  description: 'Returns ping and web socket information.',
  aliases: ['ws'],
  async execute (client, message, args) {
    const ws = client.ws;
    const connections = ['READY', 'CONNECTING', 'RECONNECTING', 'IDLE', 'NEARLY', 'DISCONNECTED'];

    const apiPing = Math.round(ws.ping);
    const responseTime = Math.round(Date.now() - message.createdTimestamp);
    const connectionStatus = connections[ws.status];
    const gateway = ws.gateway;

    return message.channel.send(new client.discord.MessageEmbed()
      .setColor(client.config.embedColor)
      .setTitle('Ping')
      .addField('API Ping:', `\`\`${apiPing}ms\`\``, true)
      .addField('Response Time:', `\`\`${responseTime}ms\`\``, true)
      .addField('Connection Status:', `\`\`${connectionStatus}\`\``, true)
      .addField('Gateway:', `\`\`${gateway}\`\``, true)
      .setTimestamp());
  }
};
