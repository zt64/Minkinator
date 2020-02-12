module.exports = {
  name: 'invite',
  category: 'Utility',
  description: 'Generates an invitation link for Minkinator',
  async execute (client, message, args) {
    const inviteURL = await client.generateInvite(['ADMINISTRATOR']);

    return message.channel.send(new client.discord.MessageEmbed()
      .setColor(client.config.embed.color)
      .setTitle('Invite Minkinator to any server')
      .setDescription(`Click on the title URL and you can add Minkinator to other servers. This does require administrator rights in the server to be added. \n\n ${inviteURL}`)
      .setURL(inviteURL)
      .setTimestamp()
    );
  }
};