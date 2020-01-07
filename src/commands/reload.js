module.exports = {
  name: 'reload',
  category: 'Administrator',
  description: 'Reloads the bot commands.',
  aliases: ['restart', 'reboot', 'r'],
  usage: '<command>',
  permissions: ['ADMINISTRATOR'],
  async execute (client, message, args) {
    const commands = client.commands;
    const events = client.events;

    const reloadEmbed = new client.discord.MessageEmbed()
      .setColor(client.config.embedColor)
      .setTitle('Reloading')
      .setDescription(`Reloading ${commands.size} commands and ${events.size} events`)
      .setTimestamp();

    const reloadMessage = await message.channel.send(reloadEmbed);

    client.removeAllListeners();
    client.commands.clear();

    await client.loadEvents();
    await client.loadCommands();

    reloadEmbed.setTitle('Finished reloading');
    reloadEmbed.setDescription(`Reloaded ${commands.size} commands and ${events.size} events in ${reloadMessage.createdTimestamp - message.createdTimestamp}ms`);

    reloadMessage.edit(reloadEmbed);
    return console.log('Finished reloading commands and events');
  }
};