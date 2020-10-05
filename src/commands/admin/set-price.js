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
    if (isNaN(newPrice) || newPrice <= 0) return message.channel.send(`\`${newPrice}\` is not a valid amount.`);

    const items = global.guildInstance.items;
    const item = items.value.filter(item => item.name === itemName);

    if (!item) return message.channel.send(`\`${itemName}\` does not exist in the guild shop.`);

    // Update item price
    item.price = newPrice;
    items.update({ value: items });

    return message.channel.send(`Successfully set the price of \`${itemName}\` to \`${newPrice}\``);
  }
};
