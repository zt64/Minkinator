module.exports = {
  description: 'Displays a users avatar.',
  aliases: ['pfp', 'a'],
  parameters: [
    {
      name: 'member',
      type: String
    }
  ],
  async execute (client, message, args) {
    const guildConfig = await client.database.properties.findByPk('configuration').then(key => key.value);
    const successColor = guildConfig.colors.success;

    const user = await client.functions.getUser(client, message, args[0]);

    return message.channel.send(new client.Discord.MessageEmbed()
      .setColor(successColor)
      .setTitle(`Avatar of ${user.tag}`)
      .setURL(user.displayAvatarURL({ format: 'png', dynamic: true, size: 256 }))
      .setImage(user.displayAvatarURL({ format: 'png', dynamic: true, size: 256 }))
      .setFooter(`User ID: ${user.id}`)
    );
  }
};