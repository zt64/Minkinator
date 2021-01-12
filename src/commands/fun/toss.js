module.exports = {
  description: "Flip a coin.",
  aliases: ["flip", "coin"],
  async execute (client, message) {
    // Generate result
    const result = Math.random() > 0.5 ? "Heads" : "Tails";
    
    // Send embed
    return message.channel.send(new Discord.MessageEmbed({
      color: global.guildInstance.config.colors.default,
      title: "Coin Toss",
      description: result
    }));
  }
};