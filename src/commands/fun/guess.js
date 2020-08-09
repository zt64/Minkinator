module.exports = {
  description: "Guess a number 1 - 100 to earn a reward.",
  coolDown: 30,
  parameters: [
    {
      name: "guess",
      type: Number,
      required: true
    }
  ],
  async execute (client, message, args) {
    const guildConfig = await client.database.properties.findByPk("configuration").then(key => key.value);
    const memberData = await client.database.members.findByPk(message.author.id);

    const guess = Math.round(args[0]);

    if (guess < 1 || guess > 100) return message.channel.send("Guess must be 1 - 100, inclusive.");

    // Set guild constants
    const successColor = guildConfig.colors.success;
    const currency = guildConfig.currency;

    const { formatNumber, randomInteger } = client.functions;

    let balance = memberData.balance;
    let earn;

    const value = randomInteger(1, 100);

    const embed = new client.Discord.MessageEmbed();

    if (value === guess) {
      embed.setColor("#F0B27A");
      embed.setTitle("Jackpot!");

      earn = 1000;
    } else {
      embed.setColor(successColor);
      embed.setTitle("Guessing Game");

      earn = 50 / Math.abs(value - guess) * 4;
    }

    balance += earn;

    await memberData.update({ balance: balance });

    embed.setDescription(`You guessed ${guess}, and the number was ${value}. \n Earning you ${currency}${formatNumber(earn, 2)} puts your balance at ${currency}${formatNumber(balance, 2)}.`);

    return message.channel.send(embed);
  }
};