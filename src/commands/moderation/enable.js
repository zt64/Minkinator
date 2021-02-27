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
    const guildInstance = await global.sequelize.models.guild.findByPk(message.guild.id);
    const { commands } = guildInstance;

    // Make sure command exists in array
    if (!commands.includes(commandName)) {
      return message.reply(`\`${commandName}\` is either non-existent or already enabled.`);
    }

    // Update commands in database
    await guildInstance.update({ commands: commands.filter(element => element !== commandName) });

    return message.reply(`Enabled \`${commandName}\`.`);
  }
};