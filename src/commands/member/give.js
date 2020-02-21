module.exports = {
  name: 'give',
  description: 'Gives money to another member.',
  aliases: ['send', 'pay'],
  parameters: [
    {
      name: 'member',
      type: String,
      required: true
    },
    {
      name: 'amount',
      type: Number,
      required: true
    }
  ],
  async execute (client, message, args) {
    if (!message.mentions.members.first()) return message.reply(`${message.mentions.members.first()} is not a valid member.`);
    if (args[1] < 1 || isNaN(args[1])) return message.reply('That is not a valid amount.');

    const target = await client.database.members.findByPk(message.mentions.members.first().id);
    const member = await client.database.members.findByPk(message.author.id);

    if (member.balance - args[1] >= 0) {
      await member.update({ balance: member.balance - parseInt(args[1]) });
      await target.update({ balance: target.balance + parseInt(args[1]) });

      return message.channel.send(new client.discord.MessageEmbed()
        .setTitle('Payment Transaction')
        .setColor(client.config.embed.color)
        .setDescription(`${message.author} has sent ${client.config.currency}${args[1]} to ${message.mentions.members.first()}`)
        .addField(`${message.author.username}'s new balance:`, `${client.config.currency}${member.balance}`, true)
        .addField(`${message.mentions.members.first().user.username}'s new balance:`, `${client.config.currency}${target.balance}`, true)
        .setTimestamp()
      );
    } else {
      return message.reply(`You are missing the additional ${client.config.currency}${Math.abs(args[1] - member.balance)}.`);
    }
  }
};