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
  async execute (client, message, [ member, amount ]) {
    const { currency, colors } = global.guildInstance.config;

    amount = parseInt(amount);

    const target = await util.getUser(client, message, member);

    if (!message.mentions.members.first()) return message.reply(`\`${target}\` is not a valid member.`);
    if (amount < 1 || isNaN(amount)) return message.channel.send(`\`${amount}\` is not a valid amount.`);

    // Get data for the sender and receiver
    const [ targetInstance ] = await global.sequelize.models.member.findOrCreate({ where: { userId: target.user.id } });
    const { memberInstance } = global;

    if (memberInstance.balance - amount < 0) return message.reply(`You are missing the additional ${currency}${Math.abs(amount - memberInstance.balance)}.`);

    // Adjust balances
    await memberInstance.decrement("balance", { by: parseInt(amount) });
    await targetInstance.increment("balance", { by: parseInt(amount) });

    return message.channel.send(new Discord.MessageEmbed()
      .setColor(colors.default)
      .setTitle("Payment Transaction")
      .setDescription(`${message.author} has sent ${currency}${amount} to ${target}`)
      .addField(`${message.author.username} new balance:`, `${currency}${util.formatNumber(memberInstance.balance - amount, 2)}`, true)
      .addField(`${target.user.username} new balance:`, `${currency}${util.formatNumber(targetInstance.balance + amount, 2)}`, true)
    );
  }
};