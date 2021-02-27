module.exports = {
  description: "Revokes a members ban.",
  permissions: ["BAN_MEMBERS"],
  parameters: [
    {
      name: "member",
      type: String,
      required: true
    },
    {
      name: "reason",
      type: String
    }
  ],
  async execute (client, message) {
    if (!message.mentions.members.first()) return message.reply(`${message.mentions.members.first()} is not a valid member.`);

    const guildConfig = global.guildInstance.config;
    const defaultColor = guildConfig.colors.default;

    const member = message.mentions.members.first();

    // Un-ban member
    message.guild.unban(member.user);

    // Send embed
    return message.reply({
      embed: {
        color: defaultColor,
        author: { url:  member.user.avatarURL, name: `${member.user.tag} has been unbanned` },
        footer: { text: member.id }
      }
    });
  }
};