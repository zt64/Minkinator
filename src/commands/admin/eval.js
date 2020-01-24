/* eslint-disable no-eval */
module.exports = {
  name: 'eval',
  description: 'Evaluates Javascript code.',
  aliases: ['evaluate'],
  botOwner: true,
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
        .setColor(client.config.embedColor)
        .setTitle('JS Result')
        .setDescription(`\`\`\`js\n${await eval(`(async() => {return ${args.join(' ')}})()`)}\n\`\`\``)
      );
    } catch (e) {
      return message.channel.send(new client.discord.MessageEmbed()
        .setColor(client.config.embedError)
        .setTitle('JS Error')
        .setDescription(`\`\`\`js\n${e}\n\`\`\``)
      );
    }
  }
};