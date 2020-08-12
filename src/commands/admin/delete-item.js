module.exports = {
  description: "Delete an item from the guild shop.",
  aliases: ["remove-item", "del-item"],
  parameters: [
    {
      name: "item",
      type: String,
      required: true
    }
  ],
  async execute (client, message, args) {
    const itemName = args[0];

    const itemsProperty = await client.database.properties.findByPk("items");
    const items = itemsProperty.value.filter(item => item.name === itemName);

    // Check if item exists
    if (items.length === 0) return message.channel.send(`Item: \`${itemName}\`, does not exist in the guild shop.`);

    const array = itemsProperty.value.filter(item => item.name !== itemName);

    itemsProperty.update({ value: array });

    return message.channel.send(`Successfully deleted: \`${itemName}\`, from the guild shop.`);
  }
};