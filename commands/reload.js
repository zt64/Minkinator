module.exports = {
  name: 'reload',
  description: 'Reloads the bot commands.',
  aliases: ['restart', 'reboot'],
  usage: '<command>',
  roles: ['Programmer'],
  async execute (client, message, args) {
    message.channel.send(`Reloading ${client.commands.size} commands and ${client.events.size} events.`);

    client.removeAllListeners();
    client.commands.clear();

    await client.loadEvents();
    await client.loadCommands();

    message.channel.send('Finished reloading commands and events.');
    return console.log('Finished reloading commands and events');
  }
};
