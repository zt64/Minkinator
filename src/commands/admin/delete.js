module.exports = {
  description: 'Create a new variable',
  permissions: ['ADMINISTRATOR'],
  parameters: [
    {
      name: 'name',
      type: String,
      required: true
    }
  ],
  async execute (client, message, args) {
    const properties = await client.database.properties;

    const variableName = args[0];

    const variable = await properties.findByPk(variableName);

    if (!variable) return message.channel.send(`${variableName} is not a guild variable.`);

    await variable.destroy();

    return message.channel.send(`Deleted variable ${variableName}`);
  }
};