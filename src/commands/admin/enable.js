module.exports = {
  description: "Enable a command for a guild.",
  permissions: ["ADMINISTRATOR"],
  parameters: [
    {
      name: "command name",
      type: String,
      required: true
    }
  ],
  async execute (client, message, [ commandName ]) {
    const commandsKey = global.guildInstance.commands;
    const commandsArray = commandsKey.value;

    // Make sure command exists in array
    if (!commandsArray.includes(commandName)) {
      return message.channel.send(`\`${commandName}\` is either non-existent or already enabled.`);
    }

    // Update commands in database
    commandsKey.update({ value: commandsArray.filter(element => element !== commandName) });

    return message.channel.send(`Enabled \`${commandName}\`.`);
  }
};