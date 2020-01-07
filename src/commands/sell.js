module.exports = {
  name: 'sell',
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
    },
    {
      name: 'price',
      type: Number,
      required: true
    }
  ],
  async execute (client, message, args) {
    const memberData = await client.models[message.guild.name].members.findByPk(message.author.id);
    const listings = await client.models[message.guild.name].variables.findByPk('items').value;
    const inventory = memberData.inventory;
    const balance = memberData.balance;

    const itemAmount = args[0];
    const itemName = args[1];

    inventory.find(item => {
      if (item.name === itemName) {
        if (itemAmount > item.amount) return message.channel.send('You do not have that much');

        itemAmount < item.amount ? item.amount -= itemAmount : inventory.splice(, 1);

        memberData.update({ balance: itemPrice, inventory: inventory });

        return message.channel.send(`Successfully sold ${itemAmount} ${itemName}(s) for ${itemPrice}`);
      }
    });

    return message.channel.send(`You are lacking the ${itemName}`);
  }
};