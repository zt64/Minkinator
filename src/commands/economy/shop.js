module.exports = {
  description: 'Buy, sell, and see what products are available.',
  aliases: ['s'],
  subCommands: [
    {
      name: 'buy',
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
      ]
    },
    {
      name: 'sell',
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
      ]
    },
    {
      name: 'list'
    }
  ],
  parameters: [
    {
      name: 'buy | sell | list',
      type: String,
      required: true
    }
  ],
  async execute (client, message, args) {
    const subCommand = args[0];

    const properties = client.database.properties;
    const shopItems = await properties.findByPk('items').then(key => key.value);
    const guildConfig = await properties.findByPk('configuration').then(key => key.value);

    const successColor = guildConfig.colors.success;
    const currency = guildConfig.currency;

    if (subCommand === 'buy') {
      const memberData = await client.database.members.findByPk(message.author.id);
      const inventory = memberData.inventory;
      const balance = memberData.balance;

      const itemName = args[1];
      const itemAmount = parseInt(args[2]) || 1;

      if (!shopItems.find(x => x.name === itemName)) return message.channel.send(`\`${itemName}\` is not available for sale.`);

      const shopItem = shopItems.find(x => x.name === itemName);
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
        .setColor(successColor)
        .setTitle('Transaction Successful')
        .setDescription(`Bought ${client.pluralize(itemName, itemAmount, true)} for ${currency}${shopItemPrice.toLocaleString()}.`)
      );
    }

    if (subCommand === 'sell') {
      // Set member properties

      const memberData = await client.database.members.findByPk(message.author.id);
      const inventory = memberData.inventory;
      let balance = memberData.balance;

      const itemName = args[1];
      const itemAmount = parseInt(args[2]);

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
        .setColor(successColor)
        .setTitle('Transaction Successful')
        .setDescription(`Sold ${client.pluralize(itemName, itemAmount, true)} for ${currency}${sellPrice.toFixed(2)}`)
      );
    }

    if (subCommand === 'list') {
      const currency = guildConfig.currency;
      const prefix = guildConfig.prefix;

      const pages = Math.ceil(shopItems.length / 10);

      if (!pages) return message.channel.send('The shop is currently empty.');

      let page = args[1] || 1;

      if (page > pages || page < 1 || isNaN(page)) return message.channel.send(`Page \`${page}\` does not exist.`);

      const shopEmbed = new client.Discord.MessageEmbed()
        .setColor(successColor)
        .setTitle(`${message.guild.name} shop`)
        .setDescription(`Buy items using \`${prefix}shop buy [item] [amount]\` \n Sell items using \`${prefix}shop sell [item] [amount] [price]\``)
        .setFooter(`Page ${page} of ${pages}`);

      shopItems.slice((page - 1) * 10, page * 10).map((item, index) => {
        shopEmbed.addField(item.name, `${currency}${item.price.toLocaleString()}`, true);
      });

      const shopMessage = await message.channel.send(shopEmbed);

      if (pages > 1) shopMessage.react('➡️');

      shopMessage.react('❌');

      const filter = (reaction, user) => user.id === message.author.id && (
        ['🏠', '⬅️', '➡️', '❌'].map(emoji => reaction.emoji.name === emoji)
      );

      const collector = shopMessage.createReactionCollector(filter);

      collector.on('collect', async reaction => {
        const emoji = reaction.emoji.name;

        switch (emoji) {
          case '🏠':
            page = 1;

            shopMessage.reactions.removeAll();

            if (pages > 1) shopMessage.react('➡️');

            shopMessage.react('❌');
            break;
          case '⬅️':
            page--;

            shopMessage.reactions.removeAll();

            if (page !== 1) shopMessage.react('🏠');

            shopMessage.react('➡️');
            shopMessage.react('❌');
            break;
          case '➡️':
            page++;

            shopMessage.reactions.removeAll();

            shopMessage.react('🏠');

            if (pages > 2) shopMessage.react('⬅️');

            if (pages > page) shopMessage.react('➡️');

            shopMessage.react('❌');
            break;
          case '❌':
            return shopMessage.delete();
        }

        shopEmbed.fields = [];

        shopItems.slice((page - 1) * 10, page * 10).map((item, index) => {
          shopEmbed.addField(item.name, `${currency}${item.price.toLocaleString()}`, true);
        });

        shopEmbed.setFooter(`Page ${page} of ${pages}`);

        shopMessage.edit(shopEmbed);
      });
    }
  }
};