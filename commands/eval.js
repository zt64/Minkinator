/* eslint-disable no-eval */
module.exports = {
  name: 'eval',
  description: 'Evaluates',
  usage: '[input]',
  ownerOnly: true,
  args: true,
  execute (client, message, args) {
    try {
      message.channel.send(`\`\`\`js\n${eval(args.join(' '))}\n\`\`\``);
    } catch (e) {
      message.channel.send(`\`\`\`js\n${e}\n\`\`\``);
    }
  }
};
