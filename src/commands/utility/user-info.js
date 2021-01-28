module.exports = {
  description: "Shows the users information.",
  parameters: [
    {
      name: "member"
    }
  ],
  aliases: [ "userinfo" ],
  async execute (client, message, [ mention ]) {
    const { colors, currency } = await global.sequelize.models.guildConfig.findByPk(message.guild.id);

    const user = await util.getUser(client, message, mention);
    if (!user) return message.channel.send("Please specify a valid member.");

    const member = message.guild.member(user);

    const { balance } = await global.sequelize.models.member.findByPk(user.id);

    // Create embed
    const infoEmbed = new Discord.MessageEmbed({
      color: colors.default,
      author: { iconURL: user.avatarURL(), name: `User information: ${user.tag}` },
      fields: [
        { name: "ID:", value: user.id },
        { name: "Created:", value: user.createdAt.toLocaleDateString(), inline: true },
        { name: "Joined:", value: member.joinedAt.toLocaleDateString(), inline: true },
        { name: "Status", value: user.presence.status === "dnd" ? "DND" : util.capitalize(user.presence.status), inline: true },
        { name: "Balance:", value: `${currency}${util.formatNumber(balance, 2)}`, inline: true }
      ]
    });

    const platforms = [];

    if (user.presence.clientStatus?.web) platforms.push("Web");
    if (user.presence.clientStatus?.mobile) platforms.push("Mobile");
    if (user.presence.clientStatus?.desktop) platforms.push("Desktop");

    if (platforms.length !== 0) infoEmbed.addField("Platforms:", platforms.join(", "), true);

    if (member.roles) {
      infoEmbed.addField("Roles:", member.roles.cache.map(role => {
        if (role.name !== "@everyone") return `<@&${role.id}>`;
        return "@everyone";
      }).join(", "));
    }

    return message.channel.send(infoEmbed);
  }
};