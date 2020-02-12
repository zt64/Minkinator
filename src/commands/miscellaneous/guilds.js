module.exports = {
  name: 'guilds',
  description: 'Shows the current guilds and members Minkinator is watching.',
  aliases: ['servers'],
  async execute (client, message, args) {
    const guilds = client.guilds;

    const guildsEmbed = new client.discord.MessageEmbed()
      .setColor(client.config.embed.color)
      .setTitle(`Watching ${guilds.size} guilds and ${client.users.size} users`);

    guilds.map(guild => {
      guildsEmbed.addField(`${guild.name}`, `Members: ${guild.memberCount} \n ID: ${guild.id}`);
    });

    return message.channel.send(guildsEmbed);
  }
};