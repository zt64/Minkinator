module.exports = {
  description: "Set the inputPrice of an item in the shop.",
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
    const inputName = args[0];
    const inputPrice = args[1];

    if (isNaN(inputPrice) || inputPrice <= 0) return message.channel.send(`\`${inputPrice}\` is not a valid amount.`);

    const items = await client.database.properties.findByPk("items");
    const item = items.value.filter(item => item.name === inputName);

    if (!item) return message.channel.send(`\`${inputName}\` does not exist in the guild shop.`);

    item.price = inputPrice;
    items.update({ value: items });

    return message.channel.send(`Successfully set the inputPrice of \`${inputName}\` to \`${inputPrice}\``);
  }
};
