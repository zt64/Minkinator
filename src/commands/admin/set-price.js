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
  async execute (client, message, args) {
    const itemName = args[0];
    const price = args[1];

    if (isNaN(price) || price <= 0) return message.channel.send(`\`${price}\` is not a valid amount.`);

    const items = await client.database.properties.findByPk("items");
    const item = items.value.filter(item => item.name === itemName);

    if (!item) return message.channel.send(`\`${itemName}\` does not exist in the guild shop.`);

    item.price = price;

    items.update({ value: items });

    return message.channel.send(`Successfully set the price of \`${itemName}\` to \`${price}\``);
  }
};
