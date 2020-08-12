module.exports = {
  description: "Flip a coin.",
  aliases: ["flip", "coin"],
  async execute (client, message, args) {
    const guildConfig = await client.database.properties.findByPk("configuration").then(key => key.value);
    const defaultColor = guildConfig.colors.default;
    
    // Generate result
    const result = Math.random() > 0.5 ? "Heads" : "Tails";
    
    // Send embed
    return message.channel.send(new client.Discord.MessageEmbed()
      .setColor(defaultColor)
      .setTitle("Coin toss")
      .setDescription(result)
    );
  }
};