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
    const itemArray = await client.database.properties.findByPk('items').then(key => key.value);

    const guildConfig = await client.database.properties.findByPk('configuration').then(key => key.value);
    const embedColor = guildConfig.embedSuccessColor;
    const currency = guildConfig.currency;

    const memberData = await client.database.members.findByPk(message.author.id);
    const inventory = memberData.inventory;
    const balance = memberData.balance;

    const itemName = args[0];
    const itemAmount = parseInt(args[1]) || 1;

    if (!itemArray.find(x => x.name === itemName)) return message.channel.send(`\`${itemName}\` is not available for sale.`);

    const shopItem = itemArray.find(x => x.name === itemName);
    const shopItemPrice = itemAmount * shopItem.price;

    if (balance < shopItemPrice) return message.channel.send(`You cannot afford ${client.pluralize(itemName, itemAmount, true)}.`);

    const inventoryItem = inventory.find(item => item.name === itemName);

    if (inventoryItem) {
      inventoryItem.amount += itemAmount;
    } else {
      inventory.push(
        {
          name: itemName,
          amount: itemAmount
        }
      );
    }

    memberData.decrement('balance', { by: shopItemPrice });
    memberData.update({ inventory: inventory });

    return message.channel.send(new client.Discord.MessageEmbed()
      .setColor(embedColor)
      .setTitle('Transaction Successful')
      .setDescription(`Bought ${client.pluralize(itemName, itemAmount, true)} for ${currency}${shopItemPrice.toLocaleString()}.`)
    );
  }
};