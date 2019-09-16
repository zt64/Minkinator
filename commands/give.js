module.exports = {
  name: 'give',
  description: 'Gives money to another member.',
  aliases: ['send', 'pay'],
  usage: '[member] [amount]',
  args: true,
  async execute (client, message, args) {
    if (!message.mentions.members.first()) return message.reply(`${message.mentions.members.first()} is not a valid member.`);
    if (args[1] < 1 || isNaN(args[1])) return message.reply('That is not a valid amount.');

    const target = await client.models.members.findOne({ where: { id: message.mentions.members.first().id } });
    const member = await client.models.members.findOne({ where: { id: message.author.id } });

    if (member.balance - args[1] >= 0) {
      await member.update({ balance: member.balance - parseInt(args[1]) });
      await target.update({ balance: target.balance + parseInt(args[1]) });

      return message.channel.send(`${message.author} has sent ${client.config.currency}${args[1]} to ${args[0]}`);
    } else {
      return message.reply(`You are missing the additional ${client.config.currency}${Math.abs(args[1] - member.balance)}.`);
    }
  }
};
