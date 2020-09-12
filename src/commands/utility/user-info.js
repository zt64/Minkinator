module.exports = {
  description: "Shows the users information.",
  parameters: [
    {
      name: "member"
    }
  ],
  async execute (client, message, [ member ]) {
    const user = await global.functions.getUser(client, message, member);
    const guildConfig = global.guildInstance.guildConfig;
    const defaultColor = guildConfig.colors.default;

    const platforms = [];

    // Add platforms
    if (user.presence.clientStatus.web) platforms.push("Web");
    if (user.presence.clientStatus.mobile) platforms.push("Mobile");
    if (user.presence.clientStatus.desktop) platforms.push("Desktop");

    // Create embed
    const infoEmbed = new global.Discord.MessageEmbed()
      .setColor(defaultColor)
      .setAuthor(`User information: ${user.tag}`, user.avatarURL())
      .addField("ID:", user.id)
      .addField("Created:", user.createdAt.toLocaleDateString(), true)
      .addField("Status:", user.presence.status === "dnd" ? "DND" : global.functions.capitalize(user.presence.status), true);

    if (platforms.length !== 0) infoEmbed.addField("Platforms:", platforms.join(", "), true);

    return message.channel.send(infoEmbed);
  }
};