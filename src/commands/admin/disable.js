module.exports = {
  description: "Disable a command.",
  permissions: ["ADMINISTRATOR"],
  parameters: [
    {
      name: "command name",
      type: String,
      required: true
    }
  ],
  async execute (client, message, [ commandName ]) {
    const guildInstance = global.guildInstance;

    const commandsArray = guildInstance.commands;

    // Check if command can be disabled
    if (!client.commands.get(commandName)) {
      return message.channel.send(`\`${commandName}\` is not a valid command.`);
    } else if (commandsArray.includes(commandName)) {
      return message.channel.send(`\`${commandName}\` is already disabled.`);
    }

    // Add command to database
    commandsArray.push(commandName);

    await guildInstance.update({ commands: commandsArray });

    return message.channel.send(`Disabled \`${commandName}\`.`);
  }
};