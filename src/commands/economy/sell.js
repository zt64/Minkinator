module.exports = {
  description: 'List items.',
  parameters: [
    {
      name: 'item',
      type: String,
      required: true
    },
    {
      name: 'amount',
      type: Number,
      required: true
    }
  ],
  async execute (client, message, args) {
    const memberData = await client.model.members.findByPk(message.author.id);
    const items = (await client.model.variables.findByPk('items')).value;

    const inventory = memberData.inventory;
    const currency = await client.config.currency;

    var balance = memberData.balance;

    const itemName = args[0];
    const itemAmount = args[1];

    const shopItem = items.find(item => item.name === itemName);
    const inventoryItem = inventory.find(item => item.name === itemName);

    const itemPrice = (itemAmount * shopItem.price) / 2;

    if (!inventoryItem) return message.channel.send(`You are lacking the ${itemName}`);
    if (itemAmount > inventoryItem.amount) return message.channel.send('You do not have that much');

    inventoryItem.amount - itemAmount ? inventoryItem.amount -= itemAmount : inventory.splice(inventory.indexOf(inventoryItem), 1);

    balance += itemPrice;

    memberData.update({ balance: balance, inventory: inventory });

    return message.channel.send(`Successfully sold ${itemAmount} ${itemName}(s) for ${currency}${itemPrice.toFixed(2)}`);
  }
};