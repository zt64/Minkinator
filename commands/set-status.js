module.exports = {
  name: 'set-status',
  description: 'Changes Minkinators status.',
  usage: '[type] [name]',
  permissions: ['ADMINISTRATOR'],
  args: true,
  async execute (client, message, args) {
    const variables = client.models.variables;

    const name = await variables.findByPk('activityName');
    const type = await variables.findByPk('activityType');

    name.update({ value: args.slice(1).join(' ') });
    type.update({ value: args[0] });

    client.user.setActivity(name.value, { type: type.value.toUpperCase() });

    return message.channel.send(`Set status to \`${args.join(' ')}\`.`);
  }
};
