module.exports = {
  description: "Reloads all the bot events and commands.",
  aliases: ["restart", "r"],
  async execute (client, message) {
    const guildConfig = await client.database.properties.findByPk("configuration").then(key => key.value);
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
    
    client.commands.clear();

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
    reloadEmbed.setDescription(`Reloaded \`${commands.size}\` commands and \`${events.size}\` events in \`${ms}\` ms.`);

    return reloadMessage.edit(reloadEmbed);
  }
};