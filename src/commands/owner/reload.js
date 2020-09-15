module.exports = {
  description: "Reloads all the bot events and commands.",
  aliases: ["r"],
  async execute (client, message) {
    const guildConfig = global.guildInstance.guildConfig;
    const defaultColor = guildConfig.colors.default;

    const commands = client.commands;
    const events = client.events;

    const reloadEmbed = new global.Discord.MessageEmbed()
      .setColor(defaultColor)
      .setTitle("Reloading")
      .setDescription(`Reloading \`${commands.size}\` commands and \`${events.size}\` events.`);

    const reloadMessage = await message.channel.send(reloadEmbed);

    client.removeAllListeners();

    // Load events
    try {
      await client.loadEvents();
    } catch (error) {
      console.error(error);

      return message.channel.send("An error has occurred while reloading events.");
    }
    
    // Load commands
    try {
      await client.loadCommands();
    } catch (error) {
      console.error(error);
      
      return message.channel.send("An error has occurred while reloading commands.");
    }

    await client.emit("ready");

    const ms = Date.now() - reloadMessage.createdTimestamp;

    reloadEmbed.setTitle("Finished reloading");
    reloadEmbed.setDescription(`Reloaded \`${commands.length}\` commands and \`${events.length}\` events in \`${ms}\` ms.`);

    return reloadMessage.edit(reloadEmbed);
  }
};