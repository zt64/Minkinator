module.exports = {
  description: "Delete an item from the guild shop.",
  aliases: ["remove-item", "del-item"],
  parameters: [
    {
      name: "name",
      type: String,
      required: true
    }
  ],
  async execute (client, message, [ itemName ]) {
    const guildInstance = await global.sequelize.models.guild.findByPk(message.guild.id, { include: { all: true } });
    const shopItem = await global.sequelize.models.shopItem.findByPk(itemName);

    // Make sure item exists
    if (!shopItem) return message.reply(`Item: \`${itemName}\`, does not exist in the guild shop.`);

    await guildInstance.removeShopItem(shopItem);

    return message.reply(`Successfully deleted: \`${itemName}\`, from the guild shop.`);
  }
};