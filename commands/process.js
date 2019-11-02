var os = require('node-os-utils');

module.exports = {
  name: 'process',
  description: 'Returns the Node.js process info.',
  aliases: ['ps', 'pc'],
  async execute (client, message, args) {
    console.log(await os.cpu.usage());
    return message.channel.send(new client.discord.RichEmbed()
      .setColor('#34eb3d')
      .setTitle('Node.js process information')
      .addField('Uptime', process.uptime(), true)
      .addField('CPU Usage', `FUCK`, true)
      .addField('Process ID', process.pid, true)
      .setTimestamp()
    );
  }
};
