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
    const commandsKey = await client.database.properties.findByPk("commands");
    const commandsArray = commandsKey.value;
    const commandName = args[0];

    if (!client.commands.get(commandName)) {
      return message.channel.send(`\`${commandName}\` is not a valid command.`);
    } else if (commandsArray.includes(commandName)) {
      return message.channel.send(`\`${commandName}\` is already disabled.`);
    }

    commandsArray.push(commandName);
    commandsKey.update({ value: commandsArray });

    return message.channel.send(`Disabled \`${commandName}\`.`);
  }
};