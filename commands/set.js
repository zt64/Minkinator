module.exports = {
  name: 'set',
  description: 'Sets a property of a variable.',
  usage: ['[model] [object] [property] [value]'],
  args: true,
  async execute (client, message, args) {
    try {
      var model = client.models.sequelize.model(args[0]);
    } catch (e) {
      return message.channel.send(`Model: ${args[0]}, does not exist.`);
    }

    try {
      var object = await model.findByPk(args[1]);
    } catch (e) {
      return message.channel.send(`Object: ${args[1]}, does not exist.`);
    }

    try {
      await object.update({ [args[2]]: args[3] });
      return message.channel.send(`Set ${args[0]}.${args[1]}.${args[2]} to ${args[3]}.`);
    } catch (e) {
      return message.channel.send(`Property: ${args[2]}, does not exist.`);
    }
  }
};
