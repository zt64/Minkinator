module.exports = {
  description: 'Shows the current guilds and members Minkinator is watching.',
  aliases: ['servers'],
  async execute (client, message, args) {
    const guilds = client.guilds.cache;

    const guildsEmbed = new client.Discord.MessageEmbed()
      .setColor(client.config.embed.color)
      .setTitle(`Watching ${guilds.size} guild(s) and ${client.users.cache.size} users`);

    guilds.map(guild => {
      guildsEmbed.addField(`${guild.name}`, `Members: ${guild.memberCount} \n ID: ${guild.id}`);
    });

    return message.channel.send(guildsEmbed);
  }
};