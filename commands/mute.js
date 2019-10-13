module.exports = {
  name: 'mute',
  description: 'Mutes a member',
  usage: '[member] <minutes> <reason>',
  permissions: ['MANAGE_CHANNELS'],
  args: true,
  async execute (client, message, args) {
    if (!message.mentions.members.first()) return message.reply(`${message.mentions.members.first()} is not a valid member.`);

    const member = message.mentions.members.first();

    await member.addRole('625385600081592321');

    message.channel.send(new client.discord.RichEmbed()
      .setColor('#1ED760')
      .setTitle(`${member.user.tag} has been muted${args[1] ? ` for ${args[1]} minute(s)` : ''}.`)
      .setDescription(args[2] ? args.slice(2).join(' ') : 'No reason provided.')
      .setTimestamp());

    if (args[1]) {
      setTimeout(() => {
        member.removeRole('625385600081592321');
        return message.channel.send(`${member.user.tag} has been unmuted.`);
      }, args[1] * 60000);
    }
  }
};
