module.exports = {
  name: 'member-config',
  description: 'Change your member settings.',
  async execute (client, message, args) {
    const configEmbed = await message.channel.send(new client.discord.MessageEmbed()
      .setColor(client.config.embed.color)
      .setTitle('Member Configuration')
      .setTimestamp()
    );

    message.channel.send(configEmbed);
  }
};