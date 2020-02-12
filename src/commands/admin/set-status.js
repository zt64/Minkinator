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
    const config = client.config;

    const activityType = args[0].toUpperCase();
    const activityName = args.slice(1).join(' ');

    config.activity.type = activityType;
    config.activity.name = activityName;

    client.fs.writeFileSync('./config/config.json', JSON.stringify(config, null, 2));

    await client.user.setActivity(activityName, { type: activityType });

    return message.channel.send(new client.discord.MessageEmbed()
      .setTitle('Succesfully changed status')
      .setColor(client.config.embed.color)
      .setDescription(`Set status to \`${activityType.toLowerCase()} ${activityName}\`.`)
    );
  }
};