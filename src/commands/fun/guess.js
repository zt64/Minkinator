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

    if (guess < 1 || guess > 100) return message.reply("Guess must be 1 - 100, inclusive.");

    const memberInstance = await global.sequelize.models.user.findByPk(message.author.id);
    const { currency, colors } = await global.sequelize.models.guildConfig.findByPk(message.guild.id);
    const { formatNumber, randomInteger } = util;

    let { balance } = memberInstance;
    let earn;

    // Generate random value
    const value = randomInteger(1, 100);
    const embed = new Discord.MessageEmbed();

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

    return message.reply(embed);
  }
};