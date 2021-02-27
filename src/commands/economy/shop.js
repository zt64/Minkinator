const pluralize = require("pluralize");

module.exports = {
  description: "Buy, sell, and see what items are available.",
  aliases: ["s"],
  subCommands: [
    {
      name: "buy",
      parameters: [
        {
          name: "item",
          type: String,
          required: true
        },
        {
          name: "amount",
          type: Number,
          required: true
        }
      ],
      async execute (client, message, [ itemName, itemAmount ]) {
        const { items, config: { currency, colors } } = await global.sequelize.models.guild.findByPk(message.guild.id, { include: { all: true } });
        const memberInstance = await global.sequelize.models.member.findByPk(message.author.id);

        const { formatNumber } = util;
        const { inventory, balance } = memberInstance;

        // Set item constants
        itemAmount = parseInt(itemAmount) || 1;

        if (!items.find(x => x.name === itemName)) return message.reply(`\`${itemName}\` is not available for sale.`);

        const shopItem = items.find(x => x.name === itemName);
        const shopItemPrice = itemAmount * shopItem.price;

        if (balance < shopItemPrice) return message.reply(`You cannot afford ${pluralize(itemName, itemAmount, true)}.`);

        const inventoryItem = inventory.find(item => item.name === itemName);

        if (inventoryItem) {
          inventoryItem.amount += itemAmount;
        } else {
          inventory.push({ name: itemName, amount: itemAmount });
        }

        console.log(inventory);

        await memberInstance.decrement("balance", { by: shopItemPrice });
        await memberInstance.update({ inventory: inventory });

        return message.reply(new Discord.MessageEmbed()
          .setColor(colors.default)
          .setTitle("Transaction Successful")
          .setDescription(`Bought ${pluralize(itemName, itemAmount, true)} for ${currency}${formatNumber(shopItemPrice, 2)}.`)
        );
      }
    },
    {
      name: "sell",
      description: "Sell an item.",
      parameters: [
        {
          name: "item",
          type: String,
          required: true
        },
        {
          name: "amount",
          type: Number,
          required: true
        }
      ],
      async execute (client, message, [ itemName, itemAmount ]) {
        const { items, config: { currency, colors } } = await global.sequelize.models.guild.findByPk(message.guild.id, { include: { all: true } });
        const memberInstance = await global.sequelize.models.member.findByPk(message.author.id);

        // Set member constants
        const { inventory } = memberInstance;
        let { balance } = memberInstance;

        // Set item constants
        itemAmount = parseInt(itemAmount) || 1;

        const shopItem = items.find(item => item.name === itemName);
        const inventoryItem = inventory.find(item => item.name === itemName);

        const sellPrice = (itemAmount * shopItem.price) / 2;

        // Check if possible to sell
        if (!inventoryItem) return message.reply(`You do not have: \`${itemName}\``);
        if (itemAmount > inventoryItem.amount) return message.reply(`You are missing the additional: \`${itemAmount - inventoryItem.amount}\` ${itemName}.`);

        inventoryItem.amount - itemAmount ? inventoryItem.amount -= itemAmount : inventory.splice(inventory.indexOf(inventoryItem), 1);

        balance += sellPrice;

        await memberInstance.update({ balance: balance, inventory: inventory });

        return message.reply(new Discord.MessageEmbed()
          .setColor(colors.default)
          .setTitle("Transaction Successful")
          .setDescription(`Sold ${pluralize(itemName, itemAmount, true)} for ${currency}${sellPrice.toFixed(2)}`)
        );
      }
    },
    {
      name: "list",
      description: "Lists all items for sale.",
      parameters: [
        {
          name: "page",
          type: Number
        }
      ],
      async execute (client, message, [ page ]) {
        const { items, config: { currency, prefix, colors } } = await global.sequelize.models.guild.findByPk(message.guild.id, { include: { all: true } });
        const { formatNumber } = util;

        // Setup pages
        const pages = Math.ceil(items.length / 10);

        if (!pages) return message.reply("The shop is currently empty.");

        if (!page) page = 1;

        if (page > pages || page < 1 || isNaN(page)) return message.reply(`Page \`${page}\` does not exist.`);

        // Create embed
        const shopEmbed = new Discord.MessageEmbed()
          .setColor(colors.default)
          .setTitle(`${message.guild.name} shop`)
          .setDescription(`Buy items using \`${prefix}shop buy [item] [amount]\` \n Sell items using \`${prefix}shop sell [item] [amount] [price]\``)
          .setFooter(`Page ${page} of ${pages}`);

        items.slice((page - 1) * 10, page * 10).map((item) => {
          shopEmbed.addField(item.name, `${currency}${formatNumber(item.price, 2)}`, true);
        });

        const shopMessage = await message.reply(shopEmbed);

        if (pages > 1) shopMessage.react("➡️");

        const filter = (reaction, user) => user.id === message.author.id;

        const collector = shopMessage.createReactionCollector(filter);

        // Functions for each reaction
        collector.on("collect", async reaction => {
          const emoji = reaction.emoji.name;

          switch (emoji) {
          case "🏠":
            page = 1;

            shopMessage.reactions.removeAll();

            if (pages > 1) shopMessage.react("➡️");

            shopMessage.react("❌");
            break;
          case "⬅️":
            page--;

            shopMessage.reactions.removeAll();

            if (page !== 1) shopMessage.react("🏠");

            shopMessage.react("➡️");
            shopMessage.react("❌");
            break;
          case "➡️":
            page++;

            shopMessage.reactions.removeAll();

            shopMessage.react("🏠");

            if (pages > 2) shopMessage.react("⬅️");

            if (pages > page) shopMessage.react("➡️");

            shopMessage.react("❌");
            break;
          }

          shopEmbed.fields = [];

          items.slice((page - 1) * 10, page * 10).map((item) => {
            shopEmbed.addField(item.name, `${currency}${formatNumber(item.price, 2)}`, true);
          });

          shopEmbed.setFooter(`Page ${page} of ${pages}`);

          shopMessage.edit(shopEmbed);
        });
      }
    }
  ]
};