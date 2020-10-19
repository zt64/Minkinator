module.exports = {
  description: "Stops the bot.",
  aliases: ["exit", "quit", "shutdown"],
  async execute (client, message) {
    await console.log("Shutting down.");
    await message.channel.send("Shutting down.");

    client.destroy();
    process.exit();
  }
};
