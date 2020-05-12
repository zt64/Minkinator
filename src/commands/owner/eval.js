/* eslint-disable no-eval */
module.exports = {
  description: 'Evaluates Javascript code.',
  aliases: ['evaluate'],
  parameters: [
    {
      name: 'input',
      required: true
    }
  ],
  async execute (client, message, args) {
    const guildConfig = await client.database.properties.findByPk('configuration').then(key => key.value);
    const successColor = guildConfig.colors.success;

    try {
      return message.channel.send(new client.Discord.MessageEmbed()
        .setColor(successColor)
        .setTitle('JS Result')
        .setDescription(`\`\`\`js\n${await eval(`(async() => {${args.join(' ')}})()`)}\`\`\``)
      );
    } catch (error) {
      return message.channel.send(new client.Discord.MessageEmbed()
        .setColor(successColor)
        .setTitle('JS Error')
        .setDescription(`\`\`\`js\n${error}\`\`\``)
      );
    }
  }
};