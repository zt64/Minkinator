module.exports = {
  name: 'status',
  description: 'Changes Minkinators status.',
  usage: '[type] [name]',
  roles: ['Programmer'],
  args: true,
  execute (client, message, args) {
    client.user.setPresence({
      game: {
        type: args[0],
        name: args.join(' ').slice(args[0].length)
      }
    });

    return message.channel.send(`Set status to ${args.join(' ')}.`);
  }
};
