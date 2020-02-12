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
      return message.channel.send(new client.discord.MessageEmbed()
        .setColor(client.config.embed.color)
        .setTitle('JS Result')
        .setDescription(`\`\`\`js\n${await eval(`(async() => {${args.join(' ')}})()`)}\n\`\`\``)
      );
    } catch (e) {
      return message.channel.send(new client.discord.MessageEmbed()
        .setColor(client.config.embed.error)
        .setTitle('JS Error')
        .setDescription(`\`\`\`js\n${e}\n\`\`\``)
      );
    }
  }
};