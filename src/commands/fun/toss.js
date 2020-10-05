module.exports = {
  description: "Flip a coin.",
  aliases: ["flip", "coin"],
  async execute (client, message) {
    const guildConfig = global.guildInstance.guildConfig;
    const defaultColor = guildConfig.colors.default;
    
    // Generate result
    const result = Math.random() > 0.5 ? "Heads" : "Tails";
    
    // Send embed
    return message.channel.send(new global.Discord.MessageEmbed()
      .setColor(defaultColor)
      .setTitle("Coin toss")
      .setDescription(result)
    );
  }
};