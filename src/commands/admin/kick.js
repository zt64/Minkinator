module.exports = {
  description: 'Kicks a member.',
  usage: '[member] <reason>',
  permissions: ['KICK_MEMBERS'],
  parameters: [
    {
      name: 'member',
      type: String,
      required: true
    },
    {
      name: 'reason',
      type: String
    }
  ],
  execute (client, message, args) {
    const member = message.mentions.members.first();
    const reason = args.slice(1).join(' ');

    if (!member) return message.reply(`${message.mentions.members.first()} is not a valid member.`);

    message.guild.member(member).kick();

    return message.channel.send(new client.discord.MessageEmbed()
      .setColor(client.config.embed.color)
      .setTitle(`${member.user.tag} has been kicked`)
      .setDescription(args[2] ? reason : 'No reason provided.')
      .setTimestamp());
  }
};