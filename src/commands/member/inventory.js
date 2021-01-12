module.exports = {
  description: "Shows a members inventory.",
  aliases: ["inv"],
  parameters: [
    {
      name: "member",
      type: String
    }
  ],
  async execute (client, message) {
    const user = message.mentions.users.first() || message.author;
    const member = message.guild.member(user);

    // Create embed
    const inventoryEmbed = new Discord.MessageEmbed({
      color: global.guildInstance.config.colors.default,
      title: `Inventory of ${member.displayName}`
    });

    // Add items to embed
    global.memberInstance.inventory.map(item => inventoryEmbed.addField(item.name, item.amount, true));

    if (!inventoryEmbed.fields.length) inventoryEmbed.setDescription("No items present.");

    return message.channel.send(inventoryEmbed);
  }
};