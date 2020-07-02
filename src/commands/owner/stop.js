module.exports = {
  description: "Stops the bot.",
  aliases: ["stop", "exit", "quit"],
  parameters: [
    {
      name: "seconds",
      type: Number
    }
  ],
  async execute (client, message, args) {
    const sleep = client.functions.sleep;

    if (args[0]) {
      message.channel.send(`Shutting down in ${args[0]} seconds.`);
      await sleep(args[0] * 1000);
    }

    await console.log("Shutting down.");
    await message.channel.send("Shutting down.");

    client.destroy();
    process.exit();
  }
};