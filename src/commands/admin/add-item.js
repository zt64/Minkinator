module.exports = {
  description: "Add an item to the guild shop.",
  permissions: ["ADMINISTRATOR"],
  parameters: [
    {
      name: "name",
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
    const currency = global.guildInstance.guildConfig.currency;

    const itemName = args[0];
    const itemPrice = parseInt(args[1]);

    // Only allow positive integers for price
    if (isNaN(itemPrice) || itemPrice <= 0) return message.channel.send(`Item price must be a number above ${currency}0.`);

    global.guildInstance.createShopItem({ name: itemName, price: itemPrice, guildId: message.guild.id });

    return message.channel.send(`Successfully added: \`${itemName}\`, to the guild shop for ${currency}${itemPrice}.`);
  }
};