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
    const guildConfig = await client.database.properties.findByPk("configuration").then(key => key.value);
    const successColor = guildConfig.colors.success;

    const member = message.mentions.members.first();

    member.roles.remove("671902495726895127");

    return message.channel.send(new client.Discord.MessageEmbed()
      .setColor(successColor)
      .setAuthor(`${member.user.tag} has been unmuted`, member.user.avatarURL())
      .setFooter(member.id)
    );
  }
};