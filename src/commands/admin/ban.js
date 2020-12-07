module.exports = {
  description: "Bans a member.",
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
  async execute (client, message, args) {
    if (!message.mentions.members.first()) return message.reply(`${message.mentions.members.first()} is not a valid member.`);

    const guildConfig = global.guildInstance.config;
    const { bans } = global.guildInstance;
    const defaultColor = guildConfig.colors.default;

    const member = message.mentions.users.first();
    const reason = args.slice(1).join(" ");

    // Ban member
    await member.ban({ reason: reason });

    bans.push({ id: member.user.id, epoch: Date.now() });

    // Send embed
    return message.channel.send(new global.Discord.MessageEmbed({
      color: defaultColor,
      author: { url: member.user.avatarURL(), name: `${member.user.tag} has been banned${minutes ? ` for ${global.pluralize("minute", minutes, true)}` : ""}.` },
      description: reason || "No reason provided."
    }));
  }
};