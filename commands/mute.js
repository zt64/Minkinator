module.exports = {
  name: 'mute',
  description: 'Mutes a member',
  usage: '[member] <minutes> <reason>',
  args: true,
  async execute (client, message, args) {
    const member = message.mentions.members.first();

    await member.addRole('625385600081592321');

    message.channel.send(new client.discord.RichEmbed()
      .setColor('#1ED760')
      .setTitle(`${member.user.tag} has been muted${args[1] ? ` for ${args[1]} minutes` : ''}.`)
      .setDescription(args[2] ? args.slice(2).join(' ') : 'No reason provided.')
      .setTimestamp());

    if (args[1]) {
      await setTimeout(() => { member.removeRole('625385600081592321'); }, args[1] * 60000);
    }
  }
};
