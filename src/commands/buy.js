module.exports = {
  name: 'buy',
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
    const memberData = await client.models[message.guild.name].members.findByPk(message.author.id);
    const itemArray = (await client.models[message.guild.name].variables.findByPk('items')).value;
    const currency = await client.config.currency;
    const inventory = memberData.inventory;
    const balance = memberData.balance;

    const itemName = args[0];
    const amount = parseInt(args[1]) || 1;

    if (!itemArray.find(x => x.name === itemName)) return message.channel.send(`${itemName} is not available for sale.`);
    const itemPrice = itemArray.find(x => x.name === itemName).price * amount;

    if (balance < itemPrice) return message.channel.send(`You cannot afford ${amount} ${itemName}(s)`);

    inventory.find(item => {
      if (item.name === itemName) {
        item.amount += amount;
      } else {
        inventory.push(
          {
            name: itemName,
            amount: amount
          }
        );
      }
    });

    memberData.decrement('balance', { by: itemPrice });
    memberData.update({ inventory: inventory });

    return message.channel.send(`Bought ${amount} ${itemName}(s) for ${currency}${itemPrice}`);
  }
};