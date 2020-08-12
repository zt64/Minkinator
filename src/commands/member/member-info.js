module.exports = {
  description: "Displays a members statistics.",
  aliases: ["bal", "balance", "stats", "xp", "level", "lvl"],
  parameters: [
    {
      name: "member",
      type: String
    }
  ],
  async execute (client, message, args) {
    const guildConfig = await client.database.properties.findByPk("configuration").then(key => key.value);
    const defaultColor = guildConfig.colors.default;
    const currency = guildConfig.currency;
    const formatNumber = client.functions.formatNumber;

    const user = message.mentions.users.first() || message.author;

    if (!user) return message.channel.send("Please specify a valid member.");

    const member = message.guild.member(user);
    const memberData = await client.database.members.findByPk(user.id);

    // Create info embed
    const infoEmbed = new client.Discord.MessageEmbed()
      .setColor(defaultColor)
      .setAuthor(`Member information: ${member.nickname || user.tag}`, user.avatarURL())
      .addField("Balance:", `${currency}${formatNumber(memberData.balance, 2)}`, true)
      .addField("Level:", formatNumber(memberData.level), true)
      .addField("Total messages:", formatNumber(memberData.messages), true)
      .addField("Total experience:", `${formatNumber(memberData.xpTotal)} XP`, true)
      .addField("Required experience", `${formatNumber(memberData.xpRequired)} XP`, true)
      .addField("Joined:", member.joinedAt.toLocaleDateString(), true);

    return message.channel.send(infoEmbed);
  }
};