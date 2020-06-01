module.exports = {
  description: 'Enable a command for a guild.',
  permissions: ['ADMINISTRATOR'],
  parameters: [
    {
      name: 'command',
      type: String,
      required: true
    }
  ],
  async execute (client, message, args) {
    const commandsKey = await client.database.properties.findByPk('commands');
    const commandsArray = commandsKey.value;
    const commandName = args[0];

    if (!commandsArray.includes(commandName)) {
      return message.channel.send(`\`${commandName}\` is either non-existent or already enabled.`);
    }

    commandsKey.update({ value: commandsArray.filter(element => element !== commandName) });

    return message.channel.send(`Enabled \`${commandName}\`.`);
  }
};