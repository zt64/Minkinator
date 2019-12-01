/* eslint-disable no-eval */
module.exports = {
  name: 'eval',
  description: 'Evaluates Javascript code.',
  usage: '[input]',
  botOwner: true,
  aliases: ['evaluate'],
  args: true,
  async execute (client, message, args) {
    try {
      message.channel.send(`\`\`\`js\n${eval(args.join(' '))}\n\`\`\``);
    } catch (e) {
      message.channel.send(`\`\`\`js\n${e}\n\`\`\``);
    }
  }
};
