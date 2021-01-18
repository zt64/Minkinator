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
  async execute (client, message, [ itemName, itemPrice ]) {
    const guildInstance = await global.sequelize.models.guild.findByPk(message.guild.id, { include: { all: true } });
    const { currency } = guildInstance.config.currency;

    itemPrice = parseInt(itemPrice);

    // Only allow positive integers for price
    if (isNaN(itemPrice) || itemPrice <= 0) return message.channel.send(`Item price must be a number above ${currency}0.`);

    guildInstance.createItem({ name: itemName, price: itemPrice, guildId: message.guild.id });

    return message.channel.send(`Successfully added: \`${itemName}\`, to the guild shop for ${currency}${itemPrice}.`);
  }
};