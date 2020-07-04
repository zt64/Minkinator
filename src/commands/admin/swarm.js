module.exports = {
  description: "Sends a message a certain amount of times using random members from the guilds Minkinator is in.",
  permissions: ["MANAGE_WEBHOOKS"],
  parameters: [
    {
      name: "amount",
      type: Number,
      required: true
    },
    {
      name: "message",
      type: String,
      required: true
    }
  ],
  async execute (client, message, args) {
    const amount = args[0];
    const string = args.slice(1).join(" ");

    const users = client.users.cache.array();

    if (amount < 1) return message.channel.send("Enter an amount above one.");

    // Create webhook
    const webhook = await message.channel.createWebhook("Swarm", {
      avatar: client.user.avatarURL()
    });

    // Send messages

    for (let i = 0; i < amount; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      await webhook.send(string, { username: user.username, avatarURL: user.avatarURL() });

      await client.functions.sleep(500);
    }

    // Delete webhook

    return webhook.delete();
  }
};