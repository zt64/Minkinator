module.exports = {
  name: 'guilds',
  description: 'Shows the current guilds and members Minkinator is watching.',
  aliases: ['servers'],
  async execute (client, message, args) {
    const guilds = client.guilds;

    const guildsEmbed = new client.discord.MessageEmbed()
      .setColor(client.config.embedColor)
      .setTitle(`Watching ${guilds.size} guilds and ${client.users.size} members`);

    guilds.map(guild => {
      guildsEmbed.addField(`${guild.name}`, `Members: ${guild.members.size} \n ID: ${guild.id}`);
    });

    return message.channel.send(guildsEmbed);
  }
};