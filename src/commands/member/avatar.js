module.exports = {
  description: "Displays a users avatar.",
  aliases: ["pfp", "a"],
  parameters: [
    {
      name: "member",
      type: String
    }
  ],
  async execute (client, message, [ member ]) {
    const { colors } = global.guildInstance.config;

    // Get user
    const user = await util.getUser(client, message, member);
    const avatar = user.displayAvatarURL({ format: "png", dynamic: true, size: 256 });

    // Send embed
    return message.channel.send(new global.Discord.MessageEmbed({
      color: colors.default,
      title: `Avatar of ${user.tag}`,
      url: avatar,
      image: { url: avatar },
      footer: { text: `User ID: ${user.id}` }
    }));
  }
};