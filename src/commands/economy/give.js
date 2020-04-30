module.exports = {
  description: 'Send money to another member.',
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
    const guildConfig = await client.database.properties.findByPk('configuration').then(key => key.value);
    const embedColor = guildConfig.embedSuccessColor;
    const currency = guildConfig.currency;

    const amount = parseInt(args[1]);

    if (!message.mentions.members.first()) return message.reply(`${message.mentions.members.first()} is not a valid member.`);
    if (amount < 1 || isNaN(amount)) return message.channel.send(`${amount} is not a valid amount.`);

    const target = await client.database.members.findByPk(message.mentions.members.first().id);
    const member = await client.database.members.findByPk(message.author.id);

    if (member.balance - amount < 0) return message.reply(`You are missing the additional ${currency}${Math.abs(amount - member.balance)}.`);

    await member.decrement('balance', { by: parseInt(amount) });
    await target.increment('balance', { by: parseInt(amount) });

    return message.channel.send(new client.Discord.MessageEmbed()
      .setColor(embedColor)
      .setTitle('Payment Transaction')
      .setDescription(`${message.author} has sent ${currency}${amount} to ${message.mentions.members.first()}`)
      .addField(`${message.author.username}'s new balance:`, `${currency}${(member.balance - amount).toLocaleString()}`, true)
      .addField(`${message.mentions.members.first().user.username}'s new balance:`, `${currency}${target.balance + amount}`, true)
    );
  }
};