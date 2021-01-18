module.exports = {
  description: "Displays a members statistics.",
  aliases: ["bal", "balance", "stats"],
  parameters: [
    {
      name: "member",
      type: String
    }
  ],
  async execute (client, message) {
    const { currency, colors } = await global.sequelize.models.guildConfig.findByPk(message.guild.id);
    const { formatNumber } = util;

    const user = message.mentions.users.first() || message.author;

    if (!user) return message.channel.send("Please specify a valid member.");

    const member = message.guild.member(user);
    const memberData = await global.sequelize.models.member.findByPk(user.id);

    // Create info embed
    const infoEmbed = new Discord.MessageEmbed({
      color: colors.default,
      author: { iconURL: user.avatarURL(), name: `Member information: ${member.nickname || user.tag}` },
      fields: [
        { name: "Balance:", value: `${currency}${formatNumber(memberData.balance, 2)}`, inline: true },
        { name: "Joined:", value: member.joinedAt.toLocaleDateString(), inline: true }
      ]
    });

    return message.channel.send(infoEmbed);
  }
};