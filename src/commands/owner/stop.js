module.exports = {
  description: "Stops the bot.",
  aliases: ["exit", "quit", "shutdown"],
  async execute (client, message) {
    await console.log("Shutting down.");
    await message.reply("Shutting down.");

    client.destroy();
    process.exit();
  }
};
