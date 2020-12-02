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
  async execute (client, message, [ guess ]) {
    guess = Math.round(guess);

    if (guess < 1 || guess > 100) return message.channel.send("Guess must be 1 - 100, inclusive.");

    // Set guild constants
    const { currency, colors } = global.guildInstance.config;
    const { memberInstance, util: { formatNumber, randomInteger } } = global;

    let { balance } = memberInstance;
    let earn;

    // Generate random value
    const value = randomInteger(1, 100);

    const embed = new global.Discord.MessageEmbed();

    if (value === guess) {
      embed.setColor("#F0B27A");
      embed.setTitle("Jackpot!");

      earn = 1000;
    } else {
      embed.setColor(colors.default);
      embed.setTitle("Guessing Game");

      earn = 50 / Math.abs(value - guess) * 4;
    }

    await memberInstance.increment("balance", { by: earn });

    embed.setDescription(`You guessed ${guess}, and the number was ${value}. \nEarning you ${currency}${formatNumber(earn, 2)} puts your balance at ${currency}${formatNumber(balance + earn, 2)}.`);

    return message.channel.send(embed);
  }
};