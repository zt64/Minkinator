module.exports = {
  name: 'set-status',
  description: 'Changes Minkinators status.',
  usage: '[type] [name]',
  roles: ['Programmer'],
  args: true,
  async execute (client, message, args) {
    const variables = client.models.variables;

    const type = await variables.findByPk('presenceType');
    const name = await variables.findByPk('presenceName');

    type.update({ value: args[0] });
    name.update({ value: args.join(' ').slice(args[0].length) });

    client.user.setPresence({
      game: {
        type: type.value,
        name: name.value
      }
    });

    return message.channel.send(`Set status to \`${args.join(' ')}\`.`);
  }
};
