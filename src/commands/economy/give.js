module.exports = {
  description: "Send money to another member.",
  aliases: ["send", "pay"],
  parameters: [
    {
      name: "member",
      type: String,
      required: true
    },
    {
      name: "amount",
      type: Number,
      required: true
    }
  ],
  async execute (client, message, args) {
    const guildConfig = global.guildInstance.guildConfig;
    const defaultColor = guildConfig.colors.default;
    const currency = guildConfig.currency;

    const { formatNumber } = global.functions;

    const amount = parseInt(args[1]);

    const target = message.mentions.members.first();

    if (!message.mentions.members.first()) return message.reply(`\`${target}\` is not a valid member.`);
    if (amount < 1 || isNaN(amount)) return message.channel.send(`\`${amount}\` is not a valid amount.`);

    // Get data for the sender and receiver
    const [targetData] = global.sequelize.models.member.findOrCreate({ where: { id: target.user.id, name: target.user.tag } });
    const memberInstance = global.memberInstance;

    if (memberInstance.balance - amount < 0) return message.reply(`You are missing the additional ${currency}${Math.abs(amount - memberInstance.balance)}.`);

    // Adjust balances
    await memberInstance.decrement("balance", { by: parseInt(amount) });
    await targetData.increment("balance", { by: parseInt(amount) });

    return message.channel.send(new global.Discord.MessageEmbed()
      .setColor(defaultColor)
      .setTitle("Payment Transaction")
      .setDescription(`${message.author} has sent ${currency}${amount} to ${target}`)
      .addField(`${message.author.username}"s new balance:`, `${currency}${formatNumber(memberInstance.balance - amount, 2)}`, true)
      .addField(`${target.user.username}"s new balance:`, `${currency}${formatNumber(targetData.balance + amount, 2)}`, true)
    );
  }
};