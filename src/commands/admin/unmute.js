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
  async execute (client, message) {
    if (!message.mentions.members.first()) return message.reply(`${message.mentions.members.first()} is not a valid member.`);
    const { colors } = await global.sequelize.models.guildConfig.findByPk(message.guild.id);

    const member = message.mentions.members.first();

    // Remove mute role
    member.roles.remove("671902495726895127");

    // Send embed
    return message.channel.send(new Discord.MessageEmbed()
      .setColor(colors.default)
      .setAuthor(`${member.user.tag} has been unmuted`, member.user.avatarURL())
      .setFooter(member.id)
    );
  }
};