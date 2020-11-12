module.exports = {
  description: "Mutes a member.",
  permissions: ["MANAGE_CHANNELS"],
  parameters: [
    {
      name: "member",
      type: String,
      required: true
    },
    {
      name: "time",
      type: Number
    },
    {
      name: "reason",
      type: String
    }
  ],
  async execute (client, message, args) {
    if (!message.mentions.members.first()) return message.reply(`${message.mentions.members.first()} is not a valid member.`);

    const { mutes, config: { colors } } = global.guildInstance.config;

    const member = message.mentions.members.first();
    const reason = args.slice(2).join(" ");

    // Add muted role to member
    await member.roles.add("671902495726895127");

    mutes.push({
      id: member.user.id,
      epoch: Date.now()
    });

    return message.channel.send(new global.Discord.MessageEmbed()
      .setColor(colors.default)
      .setAuthor(`${member.user.tag} has been muted${minutes ? ` for ${global.pluralize("minute", minutes, true)}` : ""}.`, member.user.avatarURL())
      .setDescription(reason || "No reason provided.")
    );
  }
};