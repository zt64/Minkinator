module.exports = {
  name: 'set-status',
  description: 'Changes Minkinators status.',
  permissions: ['ADMINISTRATOR'],
  parameters: [
    {
      name: 'type',
      type: String,
      required: true
    },
    {
      name: 'name',
      type: String,
      required: true
    }
  ],
  async execute (client, message, args) {
    const activityType = args[0];
    const activityName = args.slice(1).join(' ');

    client.config.activityType = activityType;
    client.config.activityName = activityName;

    await client.user.setActivity(activityName, { type: activityType.toUpperCase() });

    return message.channel.send(`Set status to \`${args.join(' ')}\`.`);
  }
};