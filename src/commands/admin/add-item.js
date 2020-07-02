module.exports = {
  description: "Add an item to the guild shop.",
  permissions: ["ADMINISTRATOR"],
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
    const properties = client.database.properties;
    const currency = await properties.findByPk("configuration").then(key => key.value.currency);

    const itemName = args[0];
    const itemPrice = parseInt(args[1]);

    if (isNaN(itemPrice) || itemPrice <= 0) return message.channel.send(`Item price must be a number above ${currency}0.`);

    const itemsProperty = await properties.findByPk("items");
    const array = itemsProperty.value;

    array.push({
      name: args[0],
      price: itemPrice
    });

    await itemsProperty.update({ value: array });

    return message.channel.send(`Successfully added: \`${itemName}\`, to the guild shop for ${currency}${itemPrice}.`);
  }
};