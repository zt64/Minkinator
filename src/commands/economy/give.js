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
    const successColor = guildConfig.colors.success;
    const currency = guildConfig.currency;

    const amount = parseInt(args[1]);

    const target = message.mentions.members.first();

    if (!message.mentions.members.first()) return message.reply(`\`${target}\` is not a valid member.`);
    if (amount < 1 || isNaN(amount)) return message.channel.send(`\`${amount}\` is not a valid amount.`);

    const [targetData] = await client.database.members.findOrCreate({ where: { id: target.user.id }, defaults: { name: target.user.tag } });
    const memberData = await client.database.members.findByPk(message.author.id);

    if (memberData.balance - amount < 0) return message.reply(`You are missing the additional ${currency}${Math.abs(amount - memberData.balance)}.`);

    await memberData.decrement('balance', { by: parseInt(amount) });
    await targetData.increment('balance', { by: parseInt(amount) });

    return message.channel.send(new client.Discord.MessageEmbed()
      .setColor(successColor)
      .setTitle('Payment Transaction')
      .setDescription(`${message.author} has sent ${currency}${amount} to ${target}`)
      .addField(`${message.author.username}'s new balance:`, `${currency}${(memberData.balance - amount).toLocaleString()}`, true)
      .addField(`${target.user.username}'s new balance:`, `${currency}${targetData.balance + amount}`, true)
    );
  }
};