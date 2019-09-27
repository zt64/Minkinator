module.exports = {
  name: 'args-info',
  description: 'Information about the arguments provided.',
  usage: '[arguments]',
  args: true,
  execute (client, message, args) {
    message.channel.send(`Arguments: ${args.join(', ')}\nArguments length: ${args.length}`);
  }
};
