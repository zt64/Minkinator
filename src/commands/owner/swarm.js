module.exports = {
  description: "Sends a message a certain amount of times using random members from the guilds Minkinator is in.",
  parameters: [
    {
      name: "amount",
      type: Number,
      required: true
    },
    {
      name: "message",
      required: true
    }
  ],
  async execute (client, message, args) {
    const [ amount ] = args;
    const string = args.slice(1).join(" ");

    const members = message.guild.members.cache.array();

    if (amount < 1 || amount > 100000000) return message.reply("Enter an amount above one and no more than 100,000,000.");

    // Create webhook
    const webhook = await message.channel.createWebhook("Swarm", { avatar: client.user.avatarURL() });

    // Send messages
    for (let i = 0; i < amount; i++) {
      const { user } = members[Math.floor(Math.random() * members.length)];
      await webhook.send(string, { username: user.username, avatarURL: user.avatarURL() });

      await util.sleep(750);
    }

    // Delete webhook
    return webhook.delete();
  }
};