module.exports = {
  description: 'Lists items available to buy.',
  aliases: ['items', 'store'],
  parameters: [
    {
      name: 'page',
      type: Number
    }
  ],
  async execute (client, message, args) {
    const properties = client.database.properties;

    const items = await properties.findByPk('items').then(key => key.value);
    const guildConfig = await properties.findByPk('configuration').then(key => key.value);
    const embedColor = guildConfig.embedSuccessColor;

    const currency = guildConfig.currency;
    const prefix = guildConfig.prefix;

    const pages = Math.ceil(items.length / 10);

    if (!pages) return message.channel.send('The shop is currently empty.');

    let page = args[1] || 1;

    if (page > pages || page < 1 || isNaN(page)) return message.channel.send(`Page \`${page}\` does not exist.`);

    const shopEmbed = new client.Discord.MessageEmbed()
      .setColor(embedColor)
      .setTitle('The Shop')
      .setDescription(`Buy items using \`${prefix}buy [item] <amount>\` \n Sell items using \`${prefix}sell [item] [amount] [price]\``)
      .setFooter(`Page ${page} of ${pages}`);

    items.slice((page - 1) * 10, page * 10).map((item, index) => {
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

      items.slice((page - 1) * 10, page * 10).map((item, index) => {
        shopEmbed.addField(item.name, `${currency}${item.price.toLocaleString()}`, true);
      });

      shopEmbed.setFooter(`Page ${page} of ${pages}`);

      shopMessage.edit(shopEmbed);
    });
  }
};