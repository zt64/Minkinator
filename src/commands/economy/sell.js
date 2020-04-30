module.exports = {
  description: 'Sell an item to the shop for half the price.',
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
    const properties = client.database.properties;
    const guildConfig = await properties.findByPk('configuration').then(key => key.value);
    const shopItems = await properties.findByPk('items').then(key => key.value);

    const embedColor = guildConfig.embedSuccessColor;
    const currency = guildConfig.currency;

    // Set member properties

    const memberData = await client.database.members.findByPk(message.author.id);
    const inventory = memberData.inventory;
    let balance = memberData.balance;

    const itemName = args[0];
    const itemAmount = parseInt(args[1]);

    const shopItem = shopItems.find(item => item.name === itemName);
    const inventoryItem = inventory.find(item => item.name === itemName);

    const sellPrice = (itemAmount * shopItem.price) / 2;

    // Check if possible to sell

    if (!inventoryItem) return message.channel.send(`You do not have: \`${itemName}\``);
    if (itemAmount > inventoryItem.amount) return message.channel.send(`You are missing the additional: \`${itemAmount - inventoryItem.amount}\` ${itemName}.`);

    inventoryItem.amount - itemAmount ? inventoryItem.amount -= itemAmount : inventory.splice(inventory.indexOf(inventoryItem), 1);

    balance += sellPrice;

    memberData.update({ balance: balance, inventory: inventory });

    return message.channel.send(new client.Discord.MessageEmbed()
      .setColor(embedColor)
      .setTitle('Transaction Successful')
      .setDescription(`Sold ${client.pluralize(itemName, itemAmount, true)} for ${currency}${sellPrice.toFixed(2)}`)
    );
  }
};