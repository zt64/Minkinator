module.exports = {
  name: 'get',
  description: 'Gets a value from a database.',
  usage: '[model] <object>',
  args: true,
  async execute (client, message, args) {
    const modelData = new client.discord.RichEmbed()
    const objectData = new client.discord.RichEmbed()

    try {
      var model = client.models.sequelize.model(args[0])
    } catch (e) {
      return message.channel.send(`Model: ${args[0]}, does not exist.`)
    }

    if (!args[1]) {
      var primaryKey = model.primaryKeyAttributes[0]

      modelData.setTitle(`${args[0]}.${args[1]}`)
      modelData.setColor('#34eb3d')

      return console.log(await model.findAll().map(x => x[primaryKey]))
    }

    try {
      var object = await model.findByPk(args[1])
    } catch (e) {
      return message.channel.send(`Object: ${args[1]}, does not exist.`)
    }

    objectData.setTitle(`${args[0]}.${args[1]}`)
    objectData.setColor('#34eb3d')

    Object.entries(object.dataValues).map(([key, value]) => objectData.addField(`${key}:`, value, true))

    return message.channel.send(objectData)
  }
}
