module.exports = {
  name: 'member-config',
  description: 'Change guild settings.',
  async execute (client, message, args) {
    const configEmbed = await message.channel.send(new client.discord.MessageEmbed()
      .setColor(client.config.embed.color)
      .setTitle('Guild Configuration')
    );

    message.channel.send(configEmbed);
  }
};