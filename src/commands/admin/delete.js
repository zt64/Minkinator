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
    const variables = await client.database.variables;

    const variableName = args[0];

    const variable = await variables.findByPk(variableName);

    if (!variable) return message.channel.send(`${variableName} is not a guild variable.`);

    await variable.destroy();

    return message.channel.send(`Deleted variable ${variableName}`);
  }
};