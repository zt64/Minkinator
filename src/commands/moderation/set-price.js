module.exports = {
  description: "Set the price of an item in the shop.",
  parameters: [
    {
      name: "item",
      type: String,
      required: true
    },
    {
      name: "price",
      type: Number,
      required: true
    }
  ],
  async execute (client, message, [ itemName, newPrice ]) {
    if (isNaN(newPrice) || newPrice <= 0) return message.reply(`\`${newPrice}\` is not a valid amount.`);

    const { items } = await global.sequelize.models.guild.findByPk(message.guild.id, { include: { all: true } });
    const item = items.value.filter(item => item.name === itemName);

    if (!item) return message.reply(`\`${itemName}\` does not exist in the guild shop.`);

    // Update item price
    item.price = newPrice;
    items.update({ value: items });

    return message.reply(`Successfully set the price of \`${itemName}\` to \`${newPrice}\``);
  }
};
