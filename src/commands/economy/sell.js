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
    const guildConfig = (await client.database.properties.findByPk('configuration')).value;
    const memberData = await client.database.members.findByPk(message.author.id);
    const items = guildConfig.items;
    const currency = guildConfig.currency;

    // Set member properties

    const inventory = memberData.inventory;

    var balance = memberData.balance;

    const itemName = args[0];
    const itemAmount = args[1];

    const shopItem = items.find(item => item.name === itemName);
    const inventoryItem = inventory.find(item => item.name === itemName);

    const sellPrice = (itemAmount * shopItem.price) / 2;

    // Check if possible to sell

    if (!inventoryItem) return message.channel.send(`You are lacking the ${itemName}`);
    if (itemAmount > inventoryItem.amount) return message.channel.send('You do not have that much');

    inventoryItem.amount - itemAmount ? inventoryItem.amount -= itemAmount : inventory.splice(inventory.indexOf(inventoryItem), 1);

    balance += sellPrice;

    memberData.update({ balance: balance, inventory: inventory });

    return message.channel.send(`Successfully sold ${itemAmount} ${itemName}(s) for ${currency}${sellPrice.toFixed(2)}`);
  }
};