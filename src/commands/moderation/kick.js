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
    const guildConfig = global.guildInstance.config;

    const member = message.mentions.members.first();
    const reason = args.slice(1).join(" ");

    if (!member) return message.reply(`${message.mentions.members.first()} is not a valid member.`);

    // Kick member from guild
    message.guild.member(member).kick();

    // Send embed
    return message.reply({
      embed: {
        color: guildConfig.colors.default,
        title: `${member.user.tag} has been kicked`,
        description: reason || "No reason provided."
      }
    });
  }
};