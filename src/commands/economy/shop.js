module.exports = {
  description: 'Lists items available to buy.',
  aliases: ['list'],
  async execute (client, message, args) {
    const guildConfig = (await client.database.properties.findByPk('configuration')).value;
    const items = (await client.database.properties.findByPk('items')).value;
    const currency = guildConfig.currency;
    const prefix = guildConfig.prefix;  

    var page = args[0] || 1;
    var pages = Math.ceil(items.length / 10);

    const shopEmbed = new client.discord.MessageEmbed()
      .setColor(client.config.embed.color)
      .setTitle('The Shop')
      .setDescription(`Buy items using \`\`${prefix}buy [item] <amount>\`\` \n Sell items using \`\`${prefix}sell [item] [amount] [price]\`\``)
      .setFooter(`Page 1 of ${pages}`);

    items.map((item, index) => shopEmbed.addField(item.name, `${currency}${item.price}`, true));

    const shopMessage = await message.channel.send(shopEmbed);

    if (pages > 1) shopMessage.react('➡️');

    shopMessage.react('❌');

    const filter = (reaction, user) => user.id === message.author.id && (
      reaction.emoji.name === '🏠' ||
        reaction.emoji.name === '⬅️' ||
        reaction.emoji.name === '➡️' ||
        reaction.emoji.name === '❌'
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
          shopMessage.react('⬅️');

          if (pages > page) shopMessage.react('➡️');

          shopMessage.react('❌');
          break;
        case '❌':
          return shopMessage.delete();
      }

      shopEmbed.fields = [];

      items.map(item => shopEmbed.addField(item.name, `${currency}${item.price}`, true));

      shopEmbed.setFooter(`Page ${page} of ${pages}`);

      shopMessage.edit(shopEmbed);
    });
  }
};