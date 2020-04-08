module.exports = {
  description: 'Manipulate guild database properties.',
  permissions: ['ADMINISTRATOR'],
  parameters: [
    {
      name: 'model',
      type: String,
      required: true
    },
    {
      name: 'object',
      // type: String,
      required: true
    },
    {
      name: 'property',
      type: String,
      required: true
    },
    {
      name: 'value'
      // type: String
    }
  ],
  async execute (client, message, args) {
    const modelName = args[0];
    const objectName = args[1];
    const propertyName = args[2];
    try {
      var model = client.database.sequelize.model(modelName);
    } catch (e) {
      return message.channel.send(`Model: ${modelName}, does not exist.`);
    }

    try {
      var object = await model.findByPk(objectName);
    } catch (e) {
      return message.channel.send(`Object: ${objectName}, does not exist.`);
    }

    try {
      await object.update({ [propertyName]: JSON.parse(args.slice(3).join(' ')) });
      return message.channel.send(`Set ${modelName}: ${objectName}.${propertyName} to \`${args.slice(3).join(' ')}\`.`);
    } catch (e) {
      return message.channel.send(`Property: ${propertyName}, does not exist.`);
    }
  }
};