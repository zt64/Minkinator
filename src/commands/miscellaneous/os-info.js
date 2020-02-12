module.exports = {
  name: 'os-info',
  description: 'Returns information about the host OS.',
  aliases: ['os'],
  async execute (client, message, args) {
    const os = require('os');

    return message.channel.send(new client.discord.MessageEmbed()
      .setColor(client.config.embed.color)
      .setTitle('OS Information')
      .addField('Platform', os.platform(), true)
      .addField('Architecture', os.arch(), true)
      .addField('System Uptime', client.moment(os.uptime() * 1000).format('HH:mm:ss'), true)
      .addField('Release', os.release(), true)
      .addField('Hostname', os.hostname(), true)
      .addField('Home Directory', os.homedir(), true)
      .addField('Free Memory', `${(os.freemem() / 1e+9).toFixed(2)} GB`, true)
      .addField('Total Memory', `${(os.totalmem() / 1e+9).toFixed(2)} GB`, true)
      .addField('Version', process.version, true)
      .addField('Node Uptime', client.moment(process.uptime() * 1000).format('HH:mm:ss'), true)
      .addField('CPU', os.cpus()[0].model, true)
    );
  }
};