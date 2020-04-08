/* eslint-disable no-eval */
module.exports = {
  description: 'Evaluates Javascript code.',
  aliases: ['evaluate'],
  parameters: [
    {
      name: 'input',
      type: String,
      required: true
    }
  ],
  async execute (client, message, args) {
    try {
      return message.channel.send(new client.Discord.MessageEmbed()
        .setColor(client.config.embed.color)
        .setTitle('JS Result')
        .setDescription(await eval(`(async() => {${args.join(' ')}})()`), { code: 'js' })
      );
    } catch (error) {
      return message.channel.send(new client.Discord.MessageEmbed()
        .setColor(client.config.embed.error)
        .setTitle('JS Error')
        .setDescription(error, { code: 'js' })
      );
    }
  }
};