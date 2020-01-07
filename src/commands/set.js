module.exports = {
  name: 'set',
  category: 'Administrator',
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
      type: String,
      required: true
    },
    {
      name: 'property',
      type: String,
      required: true
    },
    {
      name: 'value',
      type: String
    }
  ],
  async execute (client, message, args) {
    try {
      var model = client.models[message.guild.name].sequelize.model(args[0]);
    } catch (e) {
      return message.channel.send(`Model: ${args[0]}, does not exist.`);
    }

    try {
      var object = await model.findByPk(args[1]);
    } catch (e) {
      return message.channel.send(`Object: ${args[1]}, does not exist.`);
    }

    try {
      await object.update({ [args[2]]: JSON.parse(args.slice(3).join(' ')) });
      return message.channel.send(`Set ${args[0]}.${args[1]}.${args[2]} to \`${args.slice(3).join(' ')}\`.`);
    } catch (e) {
      return message.channel.send(`Property: ${args[2]}, does not exist.`);
    }
  }
};