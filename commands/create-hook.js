module.exports = {
  name: 'create-hook',
  description: 'Sends a message using a webhook.',
  usage: '[message]',
  args: true,
  async execute (client, message, args) {
    const hook = await message.channel.createWebhook(message.author.username, {
      avatar: message.author.avatarURL()
    });

    await hook.send(args.join(' '));
    return hook.delete();
  }
};