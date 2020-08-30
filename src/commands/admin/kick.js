module.exports = {
  description: "Kicks a member.",
  permissions: ["KICK_MEMBERS"],
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
    const guildConfig = await client.database.properties.findByPk("configuration").then(key => key.value);
    const defaultColor = guildConfig.colors.default;

    const member = message.mentions.members.first();
    const reason = args.slice(1).join(" ");

    if (!member) return message.reply(`${message.mentions.members.first()} is not a valid member.`);

    // Kick member from guild
    message.guild.member(member).kick();

    // Send embed
    return message.channel.send(new global.Discord.MessageEmbed()
      .setColor(defaultColor)
      .setTitle(`${member.user.tag} has been kicked`)
      .setDescription(reason || "No reason provided.")
    );
  }
};