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
    const guildInstance = await global.sequelize.models.guild.findByPk(message.guild.id);
    const { commands } = guildInstance;

    // Check if command can be disabled
    if (!client.commands.get(commandName)) {
      return message.channel.send(`\`${commandName}\` is not a valid command.`);
    } else if (commands.includes(commandName)) {
      return message.channel.send(`\`${commandName}\` is already disabled.`);
    }

    await guildInstance.update({ commands: [ ...commands, commandName] });

    return message.channel.send(`Disabled \`${commandName}\`.`);
  }
};