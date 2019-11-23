module.exports = {
  name: 'guilds',
  description: 'Shows the current guilds and members Minkinator is watching.',
  async execute (client, message, args) {
    const guilds = client.guilds;

    return message.channel.send(new client.discord.MessageEmbed()
      .setColor(client.config.embedColor)
      .addField(`Watching ${guilds.size} guilds and ${client.users.size} members.`, guilds.map(guild => `${guild.name}`).join(', '))
    );
  }
};
