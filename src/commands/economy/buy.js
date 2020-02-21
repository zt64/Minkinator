module.exports = {
  description: 'Buy a shop item.',
  parameters: [
    {
      name: 'item',
      type: String,
      required: true
    },
    {
      name: 'amount',
      type: Number
    }
  ],
  async execute (client, message, args) {
    const memberData = await client.database.members.findByPk(message.author.id);
    const itemArray = (await client.database.variables.findByPk('items')).value;
    const currency = await client.config.currency;
    const inventory = memberData.inventory;
    const balance = memberData.balance;

    const itemName = args[0];
    const amount = parseInt(args[1]) || 1;

    if (!itemArray.find(x => x.name === itemName)) return message.channel.send(`${itemName} is not available for sale.`);

    const shopItem = itemArray.find(x => x.name === itemName);
    const shopItemPrice = amount * shopItem.price;

    if (balance < shopItemPrice) return message.channel.send(`You cannot afford ${amount} ${itemName}(s)`);

    const inventoryItem = inventory.find(item => item.name === itemName);

    if (inventoryItem) {
      inventoryItem.amount += amount;
    } else {
      inventory.push(
        {
          name: itemName,
          amount: amount
        }
      );
    }

    memberData.decrement('balance', { by: shopItemPrice });
    memberData.update({ inventory: inventory });

    return message.channel.send(`Bought ${amount} ${itemName}(s) for ${currency}${shopItemPrice.toFixed(2)}`);
  }
};