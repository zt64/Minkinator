module.exports = {
  description: 'Guess a number 1 - 100 to earn a reward.',
  parameters: [
    {
      name: 'guess',
      type: Number,
      required: true
    }
  ],
  coolDown: '120',
  async execute (client, message, args) {
    const member = await client.database.members.findByPk(message.author.id);
    const currency = client.config.currency;
    const guess = Math.floor(args[0]);

    const value = Math.round(Math.random() * 100);
    const earn = value === guess ? 1000 : (50 / Math.abs(value - guess) * 4).toFixed(2);

    const newBalance = (member.balance + parseFloat(earn)).toFixed(2);

    await member.update({ balance: newBalance });

    return message.channel.send(new client.discord.MessageEmbed()
      .setColor(client.config.embed.color)
      .setTitle('Number Guessing Game')
      .setDescription(`You guessed ${guess}, and the number was ${value}. \n Earning you ${currency}${earn} puts your balance at ${currency}${newBalance}`)
    );
  }
};