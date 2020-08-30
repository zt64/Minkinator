module.exports = {
  description: "Generates an invitation link for Minkinator",
  async execute (client, message) {
    const guildConfig = await client.database.properties.findByPk("configuration").then(key => key.value);
    const defaultColor = guildConfig.colors.default;

    // Generate URL for invite
    const inviteURL = await client.generateInvite(["ADMINISTRATOR"]);

    return message.channel.send(new global.Discord.MessageEmbed()
      .setColor(defaultColor)
      .setTitle("Invite Minkinator to any server")
      .setDescription(`Click on the title URL and you can add Minkinator to other servers. This does require administrator rights in the server to be added. \n\n ${inviteURL}`)
      .setURL(inviteURL)
    );
  }
};