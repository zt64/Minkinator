const moment = require("moment");

module.exports = {
  description: "Shows the users information.",
  parameters: [
    {
      name: "user"
    }
  ],
  aliases: [ "userinfo", "bal", "balance", "money" ],
  async execute (client, message, [ mention ]) {
    const { currency } = await global.sequelize.models.guildConfig.findByPk(message.guild.id);

    const user = await util.getUser(client, message, mention);
    if (!user) return message.reply("Please specify a valid member.");

    const member = await message.guild.members.fetch(user.id);

    const { balance } = await global.sequelize.models.user.findByPk(user.id);

    // Create embed
    const infoEmbed = new Discord.MessageEmbed({
      color: global.config.colors.default,
      author: { iconURL: user.avatarURL(), name: `User information: ${user.tag}` },
      fields: [
        { name: "Created:", value: moment(user.createdAt).format("MMMM Do YYYY, h:mm a"), inline: true },
        { name: "Joined:", value: moment(member.joinedAt).format("MMMM Do YYYY, h:mm a"), inline: true },
        { name: "Status", value: user.presence.status === "dnd" ? "DND" : util.capitalize(user.presence.status), inline: true },
        { name: "Balance:", value: `${currency}${util.formatNumber(balance, 2)}`, inline: true }
      ],
      footer: { text: `User ID: ${user.id}` }
    });

    if (member.nickname) infoEmbed.addField("Nickname:", member.nickname, true);

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

    return message.reply(infoEmbed);
  }
};