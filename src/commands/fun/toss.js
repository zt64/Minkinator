module.exports = {
  description: "Flip a coin.",
  aliases: ["flip", "coin"],
  async execute (_, message) {
    // Generate result
    const result = Math.random() > 0.5 ? "Heads" : "Tails";

    // Send embed
    return message.reply({
      embed: {
        color: global.config.colors.default,
        title: "Coin Toss",
        description: result
      }
    });
  }
};