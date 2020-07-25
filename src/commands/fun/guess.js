module.exports = {
  description: "Guess a number 1 - 100 to earn a reward.",
  coolDown: 120,
  parameters: [
    {
      name: "guess",
      type: Number,
      required: true
    }
  ],
  async execute (client, message, args) {
    const memberData = await client.database.members.findByPk(message.author.id);
    const guildConfig = await client.database.properties.findByPk("configuration").then(key => key.value);
    const successColor = guildConfig.colors.success;
    const currency = guildConfig.currency;

    const { formatNumber } = client.functions;

    const guess = Math.floor(args[0]);

    const value = Math.round(Math.random() * 100);
    const earn = value === guess ? 1000 : (50 / Math.abs(value - guess) * 4).toFixed(2);

    const newBalance = memberData.balance + parseFloat(earn);

    await memberData.update({ balance: newBalance });

    return message.channel.send(new client.Discord.MessageEmbed()
      .setColor(successColor)
      .setTitle("Guessing Game")
      .setDescription(`You guessed ${guess}, and the number was ${value}. \n Earning you ${currency}${earn} puts your balance at ${currency}${formatNumber(newBalance, 2)}.`)
    );
  }
};