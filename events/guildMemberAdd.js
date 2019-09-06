module.exports = async (client, member) => {
  console.log(`${member.user.tag} has joined the server.`);

  const embed = new client.discord.RichEmbed()
    .setFooter('User joined')
    .setColor('#1ED760')
    .setTimestamp();

  client.channels.get('618243068956508160').send(embed);

  await client.models.users.create({ name: member.user.tag, id: member.id });
};
