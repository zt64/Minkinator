module.exports = {
  description: "Disable a command.",
  permissions: ["ADMINISTRATOR"],
  parameters: [
    {
      name: "command",
      type: String,
      required: true
    }
  ],
  async execute (client, message, args) {
    const commandsKey = global.guildInstance.commands;
    const commandsArray = commandsKey.value;
    const commandName = args[0];

    // Check if command can be disabled
    if (!client.commands.get(commandName)) {
      return message.channel.send(`\`${commandName}\` is not a valid command.`);
    } else if (commandsArray.includes(commandName)) {
      return message.channel.send(`\`${commandName}\` is already disabled.`);
    }

    // Add command to database
    commandsArray.push(commandName);
    commandsKey.update({ value: commandsArray });

    return message.channel.send(`Disabled \`${commandName}\`.`);
  }
};