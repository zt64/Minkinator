module.exports = {
  description: 'Reloads the bot commands.',
  aliases: ['restart', 'reboot', 'r'],
  usage: '<command>',
  async execute (client, message, args) {
    const commands = client.commands;
    const events = client.events;

    const reloadEmbed = new client.discord.MessageEmbed()
      .setColor(client.config.embed.color)
      .setTitle('Reloading')
      .setDescription(`Reloading ${commands.size} commands and ${events.size} events`)
      .setTimestamp();

    const reloadMessage = await message.channel.send(reloadEmbed);

    client.removeAllListeners();
    client.commands.clear();

    try {
      await client.loadEvents();
      await client.loadCommands();
    } catch (error) {
      console.error(error);
      return message.channel.send('An error has occured reloading. Please check console.');
    }

    reloadEmbed.setTitle('Finished reloading');
    reloadEmbed.setDescription(`Reloaded ${commands.size} commands and ${events.size} events in ${reloadMessage.createdTimestamp - message.createdTimestamp}ms`);

    reloadMessage.edit(reloadEmbed);

    return console.log('Finished reloading commands and events');
  }
};