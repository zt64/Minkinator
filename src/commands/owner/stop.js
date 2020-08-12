module.exports = {
  description: "Stops the bot.",
  aliases: ["exit", "quit"],
  async execute (client, message, args) {
    await console.log("Shutting down.");
    await message.channel.send("Shutting down.");

    client.destroy();
    process.exit();
  }
};