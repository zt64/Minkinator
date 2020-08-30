module.exports = {
  description: "Shows a members inventory.",
  aliases: ["inv"],
  parameters: [
    {
      name: "member",
      type: String
    }
  ],
  async execute (client, message, args) {
    const guildConfig = await client.database.properties.findByPk("configuration").then(key => key.value);
    const defaultColor = guildConfig.colors.default;

    const user = message.mentions.users.first() || message.author;
    const member = message.guild.member(user);
    const inventory = (await client.database.members.findByPk(user.id)).inventory;

    // Create embed
    const inventoryEmbed = new global.Discord.MessageEmbed()
      .setColor(defaultColor)
      .setTitle(`Inventory of ${member.displayName}`);
      
    // Add items to embed
    inventory.map(item => inventoryEmbed.addField(item.name, item.amount, true));

    if (!inventoryEmbed.fields.length) inventoryEmbed.setDescription("No items present.");

    return message.channel.send(inventoryEmbed);
  }
};