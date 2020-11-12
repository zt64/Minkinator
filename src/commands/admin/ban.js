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
      name: "minutes",
      type: Number
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
    const reason = args.slice(2).join(" ");
    const minutes = args[1];

    // Ban member
    await member.ban({ reason: reason });

    bans.push({
      id: member.user.id,
      epoch: Date.now()
    });

    // Send embed
    message.channel.send(new global.Discord.MessageEmbed()
      .setColor(defaultColor)
      .setAuthor(`${member.user.tag} has been banned${minutes ? ` for ${global.pluralize("minute", minutes, true)}` : ""}.`, member.user.avatarURL())
      .setDescription(reason || "No reason provided.")
    );

    if (!minutes) return;

    await global.functions.sleep(minutes * 60000);

    message.guild.unban(member.user);

    return message.channel.send(new global.Discord.MessageEmbed()
      .setColor(defaultColor)
      .setAuthor(`${member.user.tag} has been unbanned`, member.user.avatarURL())
    );
  }
};