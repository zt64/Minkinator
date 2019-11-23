module.exports = {
  name: 'guess',
  description: 'Guess a number 1 - 100 to earn a reward.',
  usage: '[number]',
  cooldown: '120',
  args: true,
  async execute (client, message, args) {
    const member = await client.models[message.guild.name].members.findByPk(message.author.id);
    const currency = client.config.currency;
    const guess = Math.floor(args[0]);

    const value = Math.round(Math.random() * 100);
    const earn = value !== guess ? Math.round(50 / Math.abs(value - guess) * 4) : 1000;

    await member.update({ balance: member.balance + earn });

    return message.channel.send(new client.discord.MessageEmbed()
      .setColor(client.config.embedColor)
      .setTitle('Guessing Game')
      .addField('Guess:', `${currency}${guess}`, true)
      .addField('Number:', value, true)
      .addField('Earning:', `${currency}${earn}`, true)
      .addField('Balance:', `${currency}${member.balance.toLocaleString()}`, true)
      .setFooter(message.author.id)
      .setTimestamp());
  }
};
