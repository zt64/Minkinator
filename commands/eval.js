module.exports = {
  name: 'eval',
  description: 'Evaluates',
  usage: '[input]',
  ownerOnly: true,
  args: true,
  execute (client, message, args) {
    try {
      message.channel.send(`\`\`\`js\n${eval(args.join(' '))}\n\`\`\``);
    } catch (error) {
      message.channel.send(`\`\`\`js\n${error}\n\`\`\``);
    }
  }
};
