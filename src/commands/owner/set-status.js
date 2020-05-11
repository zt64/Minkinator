module.exports = {
  description: 'Change the status of Minkinator.',
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

    const guildConfig = await client.database.properties.findByPk('configuration').then(key => key.value);
    const successColor = guildConfig.embedColors.success;

    const activityType = args[0].toUpperCase();
    const activityName = args.slice(1).join(' ');

    config.activity.type = activityType;
    config.activity.name = activityName;

    client.fs.writeFileSync('./config/config.json', JSON.stringify(config, null, 2));

    await client.user.setActivity(activityName, { type: activityType });

    return message.channel.send(new client.Discord.MessageEmbed()
      .setColor(successColor)
      .setTitle('Successfully changed status')
      .setDescription(`Set status to \`${activityType.toLowerCase()} ${activityName}\`.`)
    );
  }
};