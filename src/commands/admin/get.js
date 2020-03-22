module.exports = {
  description: 'Gets a value from a database.',
  permissions: ['ADMINISTRATOR'],
  parameters: [
    {
      name: 'model',
      type: String,
      required: true
    },
    {
      name: 'object',
      type: String
    }
  ],
  async execute (client, message, args) {
    const modelDataEmbed = new client.discord.MessageEmbed();
    const objectDataEmbed = new client.discord.MessageEmbed();

    const modelName = args[0];
    const objectName = args[1];

    var page = 1;

    // Check if model exists

    try {
      var model = client.database.sequelize.model(modelName);
    } catch (e) {
      return message.channel.send(`Model: ${modelName}, does not exist.`);
    }

    // If no object provided, show all objects

    if (!args[1]) {
      const primaryKey = model.primaryKeyAttributes[0];

      modelDataEmbed.setTitle(`${modelName}`);
      modelDataEmbed.setColor(client.config.embed.color);

      await model.findAll().map(object => modelDataEmbed.addField(object[primaryKey], '\u200b', true));

      return message.channel.send(modelDataEmbed);
    }

    // Check if object exists

    try {
      var object = await model.findByPk(objectName);
    } catch (e) {
      return message.channel.send(`Object: ${objectName}, does not exist.`);
    }

    // Set embed properties

    objectDataEmbed.setTitle(`${modelName}: ${objectName}`);
    objectDataEmbed.setColor(client.config.embed.color);

    for (const [key, value] of Object.entries(object.dataValues)) {
      objectDataEmbed.addField(`${key}:`, JSON.stringify(value, null, 2), true);
    }

    // Send embed

    return message.channel.send(objectDataEmbed);
  }
};