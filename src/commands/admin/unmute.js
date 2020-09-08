module.exports = {
  description: "Revokes a members mute.",
  permissions: ["MANAGE_CHANNELS"],
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
  async execute (client, message, args) {
    if (!message.mentions.members.first()) return message.reply(`${message.mentions.members.first()} is not a valid member.`);
    const guildConfig = global.guildInstance.guildConfig;
    const defaultColor = guildConfig.colors.default;

    const member = message.mentions.members.first();

    // Remove mute role
    member.roles.remove("671902495726895127");

    // Send embed
    return message.channel.send(new global.Discord.MessageEmbed()
      .setColor(defaultColor)
      .setAuthor(`${member.user.tag} has been unmuted`, member.user.avatarURL())
      .setFooter(member.id)
    );
  }
};