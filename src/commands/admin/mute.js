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

    const properties = client.database.properties;

    const guildConfig = await properties.findByPk("configuration").then(key => key.value);
    const mutes = await properties.findByPk("mutes").then(key => key.value);
    const successColor = guildConfig.colors.success;

    const member = message.mentions.members.first();
    const reason = args.slice(2).join(" ");
    const minutes = args[1];

    await member.roles.add("671902495726895127");

    mutes.push({
      id: member.user.id,
      epoch: Date.now()
    });

    message.channel.send(new client.Discord.MessageEmbed()
      .setColor(successColor)
      .setAuthor(`${member.user.tag} has been muted${minutes ? ` for ${client.pluralize("minute", minutes, true)}` : ""}.`, member.user.avatarURL())
      .setDescription(reason || "No reason provided.")
    );

    if (!minutes) return;

    setTimeout(() => {
      member.removeRole("625385600081592321");
      return message.channel.send(new client.Discord.MessageEmbed()
        .setColor(successColor)
        .setAuthor(`${member.user.tag} has been unmuted`, member.user.avatarURL)
      );
    }, client.functions.convertTime());
  }
};