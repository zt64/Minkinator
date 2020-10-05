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
    const guildConfig = global.guildInstance.guildConfig;
    const defaultColor = guildConfig.colors.default;

    // Get user
    const user = await global.functions.getUser(client, message, member);
    const avatar = user.displayAvatarURL({ format: "png", dynamic: true, size: 256 });

    // Send embed
    return message.channel.send(new global.Discord.MessageEmbed()
      .setColor(defaultColor)
      .setTitle(`Avatar of ${user.tag}`)
      .setURL(avatar)
      .setImage(avatar)
      .setFooter(`User ID: ${user.id}`)
    );
  }
};