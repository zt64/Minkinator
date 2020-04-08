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
    const memberData = await client.database.members.findByPk(message.author.id);
    const guildConfig = (await client.database.properties.findByPk('configuration')).value;
    const currency = guildConfig.currency;
    const guess = Math.floor(args[0]);

    const value = Math.round(Math.random() * 100);
    const earn = value === guess ? 1000 : (50 / Math.abs(value - guess) * 4).toFixed(2);

    const newBalance = (memberData.balance + parseFloat(earn)).toFixed(2);

    await memberData.update({ balance: newBalance });

    return message.channel.send(new client.Discord.MessageEmbed()
      .setColor(client.config.embed.color)
      .setTitle('Number Guessing Game')
      .setDescription(`You guessed ${guess}, and the number was ${value}. \n Earning you ${currency}${earn} puts your balance at ${currency}${newBalance}`)
    );
  }
};