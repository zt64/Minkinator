module.exports = {
  name: 'guess',
  description: 'Guess a number.',
  usage: '[number]',
  cooldown: '120',
  args: true,
  async execute (client, message, args) {
    const user = await client.models.members.findByPk(message.author.id);
    const currency = client.config.currency;
    const guess = Math.floor(args[0]);

    const value = Math.round(Math.random() * 100);
    const earn = value !== guess ? Math.round(50 / Math.abs(value - guess) * 4) : 1000;

    await user.update({ balance: user.balance + earn });

    return message.channel.send(new client.discord.MessageEmbed()
      .setColor('#1ED760')
      .setTitle('Guessing Game')
      .addField('Guess:', `${currency}${guess}`, true)
      .addField('Number:', value, true)
      .addField('Earning:', `${currency}${earn}`, true)
      .addField('Balance:', `${currency}${user.balance.toLocaleString()}`, true)
      .setFooter(message.author.id)
      .setTimestamp());
  }
};
