module.exports = {
  description: "Shows the users information.",
  parameters: [
    {
      name: "member"
    }
  ],
  async execute (client, message, [ member ]) {
    const user = await global.util.getUser(client, message, member);
    const { colors } = global.guildInstance.config;

    const platforms = [];

    // Add platforms
    if (user.presence.clientStatus.web) platforms.push("Web");
    if (user.presence.clientStatus.mobile) platforms.push("Mobile");
    if (user.presence.clientStatus.desktop) platforms.push("Desktop");

    // Create embed
    const infoEmbed = new global.Discord.MessageEmbed()
      .setColor(colors.default)
      .setAuthor(`User information: ${user.tag}`, user.avatarURL())
      .addField("ID:", user.id)
      .addField("Created:", user.createdAt.toLocaleDateString(), true)
      .addField("Status:", user.presence.status === "dnd" ? "DND" : global.util.capitalize(user.presence.status), true);

    if (platforms.length !== 0) infoEmbed.addField("Platforms:", platforms.join(", "), true);

    return message.channel.send(infoEmbed);
  }
};