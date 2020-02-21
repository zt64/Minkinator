module.exports = {
  name: 'create',
  description: 'Create a new variable',
  permissions: ['ADMINISTRATOR'],
  parameters: [
    {
      name: 'name',
      type: String,
      required: true
    },
    {
      name: 'value',
      type: String,
      required: true
    }
  ],
  async execute (client, message, args) {
    const variables = await client.database.variables;

    const variableName = args[0];
    const variableValue = args[1];

    if (await variables.findByPk(variableName)) return message.channel.send(`${variableName} already is a guild variable.`);

    await variables.findOrCreate({ where: { name: variableName }, defaults: { value: variableValue } });

    return message.channel.send(`Created ${variableName} with value ${variableValue}`);
  }
};